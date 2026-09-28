import path from 'path';
import fs from 'fs';

export interface DatabaseClient {
  query<T = unknown>(sql: string, params?: unknown[]): Promise<T[]>;
  queryOne<T = unknown>(sql: string, params?: unknown[]): Promise<T | null>;
  execute(sql: string, params?: unknown[]): Promise<{ changes: number; lastInsertRowid?: number | bigint }>;
  runMigration(sql: string): Promise<void>;
}

// ─── 1. Local Node.js SQLite Driver (Zero-dependency via node:sqlite in Node 22+) ───
class LocalSqliteClient implements DatabaseClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private db: any = null;

  private async getDb() {
    if (this.db) return this.db;

    // Dynamically import node:sqlite to ensure compatibility across runtime environments
    const { DatabaseSync } = await import('node:sqlite');
    const dbDir = path.resolve(process.cwd(), 'data');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    const dbPath = path.join(dbDir, 'zaira.db');
    this.db = new DatabaseSync(dbPath);

    // Enable WAL mode and foreign keys for durability and performance
    this.db.exec('PRAGMA journal_mode = WAL;');
    this.db.exec('PRAGMA foreign_keys = ON;');

    return this.db;
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    const db = await this.getDb();
    const stmt = db.prepare(sql);
    // Convert undefined to null and boolean params to 1/0 for SQLite compatibility
    const sanitize = (val: unknown) => {
      if (val === undefined) return null;
      if (typeof val === 'boolean') return val ? 1 : 0;
      return val;
    };
    const sanitizedParams = params.map(sanitize);
    const rawRows = stmt.all(...sanitizedParams) as any[];
    return rawRows.map((row) => ({ ...row })) as T[];
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async execute(sql: string, params: unknown[] = []): Promise<{ changes: number; lastInsertRowid?: number | bigint }> {
    const db = await this.getDb();
    const stmt = db.prepare(sql);
    const sanitize = (val: unknown) => {
      if (val === undefined) return null;
      if (typeof val === 'boolean') return val ? 1 : 0;
      return val;
    };
    const sanitizedParams = params.map(sanitize);
    const result = stmt.run(...sanitizedParams);
    return {
      changes: result.changes,
      lastInsertRowid: result.lastInsertRowid,
    };
  }

  async runMigration(sql: string): Promise<void> {
    const db = await this.getDb();
    db.exec(sql);
  }
}

// ─── 2. Cloudflare D1 Remote HTTP Client ───
class CloudflareD1HttpClient implements DatabaseClient {
  private accountId: string;
  private databaseId: string;
  private apiToken: string;

  constructor(accountId: string, databaseId: string, apiToken: string) {
    this.accountId = accountId;
    this.databaseId = databaseId;
    this.apiToken = apiToken;
  }

  private async rawQuery<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Cloudflare D1 query failed: ${res.status} ${errText}`);
    }

    const data = await res.json();
    if (!data.success) {
      throw new Error(`Cloudflare D1 error: ${JSON.stringify(data.errors)}`);
    }

    return (data.result?.[0]?.results || []) as T[];
  }

  async query<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.rawQuery<T>(sql, params);
  }

  async queryOne<T = unknown>(sql: string, params: unknown[] = []): Promise<T | null> {
    const results = await this.query<T>(sql, params);
    return results.length > 0 ? results[0] : null;
  }

  async execute(sql: string, params: unknown[] = []): Promise<{ changes: number; lastInsertRowid?: number | bigint }> {
    const url = `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sql,
        params,
      }),
    });

    const data = await res.json();
    const meta = data.result?.[0]?.meta;
    return {
      changes: meta?.changes || 0,
      lastInsertRowid: meta?.last_row_id,
    };
  }

  async runMigration(sql: string): Promise<void> {
    await this.rawQuery(sql);
  }
}

// ─── Singleton Database Instance ───
let globalDb: DatabaseClient | null = null;

export function getDatabase(): DatabaseClient {
  if (globalDb) return globalDb;

  const cfAccountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const cfDatabaseId = process.env.CLOUDFLARE_D1_DATABASE_ID;
  const cfApiToken = process.env.CLOUDFLARE_API_TOKEN;

  if (cfAccountId && cfDatabaseId && cfApiToken) {
    globalDb = new CloudflareD1HttpClient(cfAccountId, cfDatabaseId, cfApiToken);
  } else {
    // Local SQLite fallback in development / test environments
    globalDb = new LocalSqliteClient();
  }

  return globalDb;
}
