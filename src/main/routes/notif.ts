import { ipcMain } from 'electron';
import { notificationService } from '../services/notificationService';
import { getUserByEmail } from '../services/userService';
import { members, notifications, payments, users } from '../db/schema';
import { and, eq, lt } from 'drizzle-orm';
import { db } from '../db';


  ipcMain.handle('fetchNotifications', async (_, { email }: { email: string }) => {
    try {
      const userId =(await getUserByEmail(email)).id
      const notifs = await notificationService.fetchNotifications(userId);
      return notifs;
    } catch (err) {
      console.error('[IPC] fetchNotifications error:', err);
      return [];
    }
  });

ipcMain.handle('checkForExpiredPayments', async () => {
  try {
    const now = new Date();
    
    // Find expired payments that haven't been notified yet
    const unpaidPayments = await db
      .select({
        userId: users.id,
        memberName: members.fullName,
        memberId: members.id,
        paymentId: payments.id,
      })
      .from(payments)
      .innerJoin(members, eq(payments.memberId, members.id))
      .innerJoin(users, eq(members.gymId, users.gymId))
      .where(and(
        lt(payments.expiresAt, now),
        eq(payments.notified, false) // Only payments not notified yet
      ));

    let newNotificationCount = 0;
    await db.transaction(async (tx) => {
      for (const payment of unpaidPayments) {
        // Create the notification
        await tx.insert(notifications).values({
          userId: payment.userId,
          memberId: payment.memberId,
          paymentId: payment.paymentId,
          message: `Payment expired for ${payment.memberName}`,
          isRead: false,
          createdAt: new Date(),
        });

        // Mark payment as notified
        await tx.update(payments)
          .set({ notified: true })
          .where(eq(payments.id, payment.paymentId));

        newNotificationCount++;
      }
    });

    return { 
      success: true,
      count: newNotificationCount,
      message: newNotificationCount > 0 
        ? `Created ${newNotificationCount} new notifications` 
        : 'No new expired payments found'
    };
    
  } catch (err) {
    console.error('Error checking expired payments:', err);
    return { 
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : 'Unknown error'
    };
  }
});
 

