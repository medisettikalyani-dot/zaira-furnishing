import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminRequest } from '@/lib/auth/admin';
import {
  getUnreadAdminWhatsAppOrdersCount,
  getAdminOrderNotifications,
  markNotificationAsRead,
  markOrderNotificationsAsRead,
  markAllAdminNotificationsAsRead,
} from '@/lib/notifications/service';

export async function GET(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get('unread_only') === 'true';
    const limit = parseInt(searchParams.get('limit') || '15', 10);

    const [unreadCount, notifications] = await Promise.all([
      getUnreadAdminWhatsAppOrdersCount(),
      getAdminOrderNotifications({ unreadOnly, limit }),
    ]);

    return NextResponse.json({
      unreadCount,
      notifications,
    });
  } catch (error) {
    console.error('Error fetching admin notifications:', error);
    return NextResponse.json({ error: 'Failed to retrieve notifications' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const isAuthorized = await verifyAdminRequest(req);
  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { notificationId, orderId, markAll } = body;

    let modified = false;

    if (markAll) {
      modified = await markAllAdminNotificationsAsRead();
    } else if (notificationId) {
      modified = await markNotificationAsRead(notificationId);
    } else if (orderId) {
      modified = await markOrderNotificationsAsRead(orderId);
    } else {
      return NextResponse.json(
        { error: 'Either notificationId, orderId, or markAll is required' },
        { status: 400 }
      );
    }

    const unreadCount = await getUnreadAdminWhatsAppOrdersCount();

    return NextResponse.json({
      success: true,
      modified,
      unreadCount,
    });
  } catch (error) {
    console.error('Error marking admin notification read:', error);
    return NextResponse.json({ error: 'Failed to update notification state' }, { status: 500 });
  }
}
