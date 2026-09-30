// src/lib/notifications/service.ts

import crypto from 'crypto';
import { getDatabase } from '@/lib/db';
import { DbOrder, DbOrderNotification, DbOrderStatusHistory, NotificationEventType, NotificationRecipientType } from '@/lib/db/types';
import { getNotificationProvider, DefaultNotificationProvider } from './provider';
import {
  generateCustomerOrderConfirmationEmail,
  generateAdminNewOrderEmail,
  generateCustomerStatusUpdateEmail,
} from './templates';

interface SendNotificationParams {
  orderId: string;
  customerId?: string | null;
  recipientType: NotificationRecipientType;
  eventType: NotificationEventType;
  recipientEmail: string;
  subject: string;
  html: string;
  text: string;
  idempotencyKey: string;
  payloadSummary: Record<string, unknown>;
}

/**
 * Core notification dispatch and recording mechanism.
 * Idempotent, safe against duplicate sends, and logs every attempt to D1.
 */
export async function recordAndSendNotification(
  params: SendNotificationParams
): Promise<{ notification: DbOrderNotification; sent: boolean }> {
  const db = getDatabase();
  const provider = getNotificationProvider();

  // 1. Check idempotency: Has this exact event already been recorded?
  const existing = await db.queryOne<DbOrderNotification>(
    'SELECT * FROM order_notifications WHERE idempotency_key = ?',
    [params.idempotencyKey]
  );

  if (existing) {
    // If already successfully sent, never send duplicate!
    if (existing.status === 'SENT') {
      return { notification: existing, sent: true };
    }
  }

  const notificationId = existing ? existing.id : `notif-${crypto.randomUUID()}`;
  const payloadSummaryJson = JSON.stringify(params.payloadSummary);

  // 2. Insert or ensure record exists with PENDING state
  if (!existing) {
    await db.execute(
      `INSERT INTO order_notifications (
        id, order_id, customer_id, recipient_type, event_type,
        recipient_email, subject, status, provider, payload_summary,
        idempotency_key, attempts, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, 0, datetime('now'), datetime('now'))`,
      [
        notificationId,
        params.orderId,
        params.customerId || null,
        params.recipientType,
        params.eventType,
        params.recipientEmail,
        params.subject,
        provider.name,
        payloadSummaryJson,
        params.idempotencyKey,
      ]
    );
  }

  // 3. Dispatch to delivery provider
  try {
    const res = await provider.send({
      to: params.recipientEmail,
      subject: params.subject,
      html: params.html,
      text: params.text,
      metadata: { orderId: params.orderId, notificationId },
    });

    if (res.success) {
      await db.execute(
        `UPDATE order_notifications SET
          status = 'SENT',
          sent_at = datetime('now'),
          provider = ?,
          provider_message_id = ?,
          error_message = NULL,
          attempts = attempts + 1,
          updated_at = datetime('now')
         WHERE id = ?`,
        [res.provider, res.messageId || null, notificationId]
      );
    } else {
      await db.execute(
        `UPDATE order_notifications SET
          status = 'FAILED',
          provider = ?,
          error_message = ?,
          attempts = attempts + 1,
          updated_at = datetime('now')
         WHERE id = ?`,
        [res.provider, res.error || 'Unknown delivery failure', notificationId]
      );
    }

    const updated = await db.queryOne<DbOrderNotification>(
      'SELECT * FROM order_notifications WHERE id = ?',
      [notificationId]
    );

    return {
      notification: updated || existing!,
      sent: res.success,
    };
  } catch (err: any) {
    // Failure must be captured cleanly without throwing
    const errorMsg = err.message || 'Fatal error during notification delivery';
    await db.execute(
      `UPDATE order_notifications SET
        status = 'FAILED',
        error_message = ?,
        attempts = attempts + 1,
        updated_at = datetime('now')
       WHERE id = ?`,
      [errorMsg, notificationId]
    );

    const updated = await db.queryOne<DbOrderNotification>(
      'SELECT * FROM order_notifications WHERE id = ?',
      [notificationId]
    );

    return {
      notification: updated || existing!,
      sent: false,
    };
  }
}

/**
 * Triggers all notifications for a newly placed and committed order:
 * 1. Customer confirmation notification
 * 2. Admin alert notification
 */
export async function triggerNewOrderNotifications(
  order: DbOrder,
  items: any[]
): Promise<{ customerNotification: DbOrderNotification; adminNotification: DbOrderNotification }> {
  const defaultProvider = new DefaultNotificationProvider();
  const adminEmail = defaultProvider.getAdminEmail();

  // 1. Customer Order Confirmation
  const customerContent = generateCustomerOrderConfirmationEmail(order, items);
  const custResult = await recordAndSendNotification({
    orderId: order.id,
    customerId: order.user_id,
    recipientType: 'CUSTOMER',
    eventType: 'NEW_ORDER_CUSTOMER',
    recipientEmail: order.customer_email,
    subject: customerContent.subject,
    html: customerContent.html,
    text: customerContent.text,
    idempotencyKey: `order_${order.id}_new_order_customer`,
    payloadSummary: {
      orderNumber: order.order_number,
      totalAmount: order.total_amount,
      itemCount: items.length,
      customerName: order.customer_name,
    },
  });

  // 2. Admin New Order Alert
  const adminContent = generateAdminNewOrderEmail(order, items);
  const adminResult = await recordAndSendNotification({
    orderId: order.id,
    customerId: order.user_id,
    recipientType: 'ADMIN',
    eventType: 'NEW_ORDER_ADMIN',
    recipientEmail: adminEmail,
    subject: adminContent.subject,
    html: adminContent.html,
    text: adminContent.text,
    idempotencyKey: `order_${order.id}_new_order_admin`,
    payloadSummary: {
      orderNumber: order.order_number,
      orderSource: order.order_source || 'WEB',
      customerName: order.customer_name,
      totalAmount: order.total_amount,
      customerPhone: order.customer_phone,
      customerEmail: order.customer_email,
    },
  });

  return {
    customerNotification: custResult.notification,
    adminNotification: adminResult.notification,
  };
}

/**
 * Triggers customer notification when an order status is updated by admin.
 * Only sends if status actually changed.
 */
export async function triggerOrderStatusUpdateNotification(
  order: DbOrder,
  previousStatus: string,
  newStatus: string
): Promise<DbOrderNotification | null> {
  if (previousStatus === newStatus) {
    return null; // No status change, do not send
  }

  const content = generateCustomerStatusUpdateEmail(order, previousStatus, newStatus);
  const result = await recordAndSendNotification({
    orderId: order.id,
    customerId: order.user_id,
    recipientType: 'CUSTOMER',
    eventType: 'ORDER_STATUS_UPDATED_CUSTOMER',
    recipientEmail: order.customer_email,
    subject: content.subject,
    html: content.html,
    text: content.text,
    idempotencyKey: `order_${order.id}_status_${newStatus}_customer`,
    payloadSummary: {
      orderNumber: order.order_number,
      previousStatus,
      newStatus,
    },
  });

  return result.notification;
}

/**
 * Retrieve notifications for an order (used by Admin Order Detail page)
 */
export async function getOrderNotifications(orderId: string): Promise<DbOrderNotification[]> {
  const db = getDatabase();
  return db.query<DbOrderNotification>(
    `SELECT * FROM order_notifications WHERE order_id = ? ORDER BY created_at DESC`,
    [orderId]
  );
}

/**
 * Record a status change in the order_status_history audit trail.
 */
export async function recordStatusHistory(
  orderId: string,
  oldStatus: string,
  newStatus: string,
  changedBy: string = 'ADMIN'
): Promise<DbOrderStatusHistory> {
  const db = getDatabase();
  const historyId = `osh-${crypto.randomUUID()}`;

  await db.execute(
    `INSERT INTO order_status_history (id, order_id, old_status, new_status, changed_by, created_at)
     VALUES (?, ?, ?, ?, ?, datetime('now'))`,
    [historyId, orderId, oldStatus, newStatus, changedBy]
  );

  const record = await db.queryOne<DbOrderStatusHistory>(
    'SELECT * FROM order_status_history WHERE id = ?',
    [historyId]
  );

  return record!;
}

/**
 * Retrieve status change history for an order.
 */
export async function getOrderStatusHistory(orderId: string): Promise<DbOrderStatusHistory[]> {
  const db = getDatabase();
  return db.query<DbOrderStatusHistory>(
    `SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC`,
    [orderId]
  );
}

/**
 * Safely retry a FAILED notification.
 * Idempotent: If the notification is already SENT, returns without re-sending.
 */
export async function retryNotification(
  notificationId: string,
  options?: { mockSuccess?: boolean }
): Promise<{ success: boolean; notification: DbOrderNotification; message?: string }> {
  const db = getDatabase();
  const provider = getNotificationProvider();

  const notification = await db.queryOne<DbOrderNotification>(
    'SELECT * FROM order_notifications WHERE id = ?',
    [notificationId]
  );

  if (!notification) {
    throw new Error('Notification record not found');
  }

  if (notification.status === 'SENT') {
    return {
      success: true,
      notification,
      message: 'Notification was already successfully delivered.',
    };
  }

  // Retrieve associated order to rebuild email
  const order = await db.queryOne<DbOrder>(
    'SELECT * FROM orders WHERE id = ?',
    [notification.order_id]
  );

  if (!order) {
    throw new Error('Associated order not found');
  }

  // Fetch items
  const items = await db.query<any>(
    'SELECT * FROM order_items WHERE order_id = ?',
    [order.id]
  );

  let content: { subject: string; html: string; text: string };
  if (notification.event_type === 'NEW_ORDER_CUSTOMER') {
    content = generateCustomerOrderConfirmationEmail(order, items);
  } else if (notification.event_type === 'NEW_ORDER_ADMIN') {
    content = generateAdminNewOrderEmail(order, items);
  } else {
    // STATUS_UPDATED
    let prev = 'CONFIRMED';
    let next = order.status;
    if (notification.payload_summary) {
      try {
        const parsed = JSON.parse(notification.payload_summary);
        if (parsed.previousStatus) prev = parsed.previousStatus;
        if (parsed.newStatus) next = parsed.newStatus;
      } catch {
        // fallback
      }
    }
    content = generateCustomerStatusUpdateEmail(order, prev, next);
  }

  const res = await provider.send({
    to: notification.recipient_email,
    subject: content.subject,
    html: content.html,
    text: content.text,
    metadata: { orderId: order.id, notificationId, mockSuccess: options?.mockSuccess },
  });

  if (res.success) {
    await db.execute(
      `UPDATE order_notifications SET
        status = 'SENT',
        sent_at = datetime('now'),
        provider = ?,
        provider_message_id = ?,
        error_message = NULL,
        attempts = attempts + 1,
        updated_at = datetime('now')
       WHERE id = ?`,
      [res.provider, res.messageId || null, notificationId]
    );
  } else {
    await db.execute(
      `UPDATE order_notifications SET
        status = 'FAILED',
        provider = ?,
        error_message = ?,
        attempts = attempts + 1,
        updated_at = datetime('now')
       WHERE id = ?`,
      [res.provider, res.error || 'Retry failed', notificationId]
    );
  }

  const updated = await db.queryOne<DbOrderNotification>(
    'SELECT * FROM order_notifications WHERE id = ?',
    [notificationId]
  );

  return {
    success: res.success,
    notification: updated!,
    message: res.success ? 'Notification delivered successfully.' : res.error,
  };
}

/**
 * Count unread admin notifications for new WhatsApp orders.
 */
export async function getUnreadAdminWhatsAppOrdersCount(): Promise<number> {
  const db = getDatabase();
  const row = await db.queryOne<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM order_notifications n
    JOIN orders o ON n.order_id = o.id
    WHERE n.recipient_type = 'ADMIN'
      AND n.event_type = 'NEW_ORDER_ADMIN'
      AND o.order_source = 'WHATSAPP'
      AND (n.is_read = 0 OR n.is_read IS NULL)
  `);
  return row?.count || 0;
}

/**
 * Retrieve admin order notifications with order metadata.
 */
export async function getAdminOrderNotifications(options?: {
  unreadOnly?: boolean;
  limit?: number;
}): Promise<any[]> {
  const db = getDatabase();
  const limit = options?.limit || 20;
  const whereClauses = [
    "n.recipient_type = 'ADMIN'",
    "n.event_type = 'NEW_ORDER_ADMIN'",
    "o.order_source = 'WHATSAPP'",
  ];

  if (options?.unreadOnly) {
    whereClauses.push('(n.is_read = 0 OR n.is_read IS NULL)');
  }

  const sql = `
    SELECT
      n.id,
      n.order_id,
      n.subject,
      n.status,
      n.is_read,
      n.read_at,
      n.payload_summary,
      n.created_at,
      o.order_number,
      o.customer_name,
      o.customer_phone,
      o.total_amount,
      o.order_source,
      o.status as order_status
    FROM order_notifications n
    JOIN orders o ON n.order_id = o.id
    WHERE ${whereClauses.join(' AND ')}
    ORDER BY n.created_at DESC
    LIMIT ?
  `;

  return db.query(sql, [limit]);
}

/**
 * Mark a specific notification as read.
 */
export async function markNotificationAsRead(notificationId: string): Promise<boolean> {
  const db = getDatabase();
  const res = await db.execute(
    "UPDATE order_notifications SET is_read = 1, read_at = datetime('now'), updated_at = datetime('now') WHERE id = ?",
    [notificationId]
  );
  return res.changes > 0;
}

/**
 * Mark all unread admin notifications for a specific order as read.
 */
export async function markOrderNotificationsAsRead(orderIdentifier: string): Promise<boolean> {
  const db = getDatabase();
  const res = await db.execute(
    `UPDATE order_notifications
     SET is_read = 1, read_at = datetime('now'), updated_at = datetime('now')
     WHERE recipient_type = 'ADMIN'
       AND (is_read = 0 OR is_read IS NULL)
       AND (
         order_id = ? OR
         order_id = (SELECT id FROM orders WHERE order_number = ?)
       )`,
    [orderIdentifier, orderIdentifier]
  );
  return res.changes > 0;
}

/**
 * Mark all unread admin WhatsApp order notifications as read.
 */
export async function markAllAdminNotificationsAsRead(): Promise<boolean> {
  const db = getDatabase();
  const res = await db.execute(
    `UPDATE order_notifications
     SET is_read = 1, read_at = datetime('now'), updated_at = datetime('now')
     WHERE recipient_type = 'ADMIN'
       AND (is_read = 0 OR is_read IS NULL)`
  );
  return res.changes > 0;
}

