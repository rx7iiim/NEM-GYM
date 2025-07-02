import { db } from '../db';
import { notifications, payments, users, gym, members } from '../db/schema';
import { and, eq, lt, desc, inArray } from 'drizzle-orm';

interface NotificationInput {
  userId: number;
  message: string;
  memberId?: number;
  paymentId?: number;
  isRead?: boolean;
}

export const notificationService = {
  /**
   * Fetch notifications for a user and mark them as read
   * @param userId - The ID of the user to fetch notifications for
   * @returns Array of notifications
   */
  async fetchNotifications(userId: number) {
    try {
        await notificationService.keepLatestMemberNotifications();
      const notifs = await db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(notifications.createdAt);

      // Mark as read in a single transaction
      await db.transaction(async (tx) => {
        await tx
          .update(notifications)
          .set({ isRead: true })
          .where(eq(notifications.userId, userId));
      });

      return notifs;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw new Error('Failed to fetch notifications');
    }
  },

  /**
   * Create a new notification
   * @param input - Notification details
   */
  async createNotification(input: NotificationInput) {
    try {
      await db.insert(notifications).values({
        userId: input.userId,
        message: input.message,
        memberId: input.memberId,
        paymentId: input.paymentId,
        isRead: input.isRead ?? false,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
  },

  /**
   * Check for expired payments and create notifications
   */
 async checkForExpiredPayments() {
  try {
    const now = new Date();


    // Find all expired payments that need notifications
    const expiredPayments = await db
      .select({
        userId: users.id,
        memberName: members.fullName,
        memberId: members.id,
        paymentId: payments.id,
        expiresAt: payments.expiresAt,
      })
      .from(payments)
      .innerJoin(members, eq(payments.memberId, members.id))
      .innerJoin(gym, eq(members.gymId, gym.id))
      .innerJoin(users, eq(gym.id, users.gymId))
      .where(
        and(
          lt(payments.expiresAt, now),
          // Optional: only active payments
          // eq(payments.status, 'active')
        )
      );

    // Process in transaction to ensure data consistency
    await db.transaction(async (tx) => {
      for (const expired of expiredPayments) {
        // First delete any existing notifications for this member's payment
        await tx
          .delete(notifications)
          .where(
            and(
              eq(notifications.memberId, expired.memberId),
              eq(notifications.paymentId, expired.paymentId)
            )
          );

        // Then create the new notification
        await tx.insert(notifications).values({
          userId: expired.userId,
          memberId: expired.memberId,
          paymentId: expired.paymentId,
          message: `Payment expired for ${expired.memberName}`,
          isRead: false,
          createdAt: new Date(),
        });

        // Optional: Update payment record to track notification
        // await tx.update(payments)
        //   .set({ lastNotifiedAt: new Date() })
        //   .where(eq(payments.id, expired.paymentId));
      }
    });

  } catch (error) {
    console.error('Error checking expired payments:', error);
    throw new Error('Failed to check expired payments');
  }
},

 async keepLatestMemberNotifications() {
  try {
    // 1. Get all notifications ordered by memberId and createdAt DESC
    const allNotifications = await db
      .select()
      .from(notifications)
      .orderBy(notifications.memberId, desc(notifications.createdAt));

    const latestPerMember = new Map<number, number>(); // memberId -> latest notificationId
    const idsToDelete: number[] = [];

    for (const notif of allNotifications) {
      if (!latestPerMember.has(notif.memberId)) {
        latestPerMember.set(notif.memberId, notif.id); // keep newest
      } else {
        idsToDelete.push(notif.id); // mark old ones
      }
    }

    if (idsToDelete.length > 0) {
      const deletedRows = await db
        .delete(notifications)
        .where(inArray(notifications.id, idsToDelete))
        .returning({ id: notifications.id }); // returns deleted rows

      return {
        success: true,
        deletedCount: deletedRows.length,
        message: `Deleted ${deletedRows.length} old notifications`,
      };
    }

    return {
      success: true,
      deletedCount: 0,
      message: 'No duplicate notifications found.',
    };
  } catch (error) {
    console.error('❌ Error cleaning notifications:', error);
    return {
      success: false,
      deletedCount: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}


};