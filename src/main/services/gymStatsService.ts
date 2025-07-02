import { db } from '../db/index';
import { users, gym, members, payments, subscriptions } from '../db/schema';
import { and, desc, eq, gt, gte, lt, sum } from 'drizzle-orm';

export class GymService {
  // Get gym ID by user email
  static async getGymIdByEmail(email: string) {
  if (!email || typeof email !== 'string') {
    throw new Error('Invalid email parameter');
  }

  const result = await db
    .select({ gymId: users.gymId })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (!result[0]) throw new Error('User not founnnnd');
  return result[0].gymId;
}

  // Fetch stats of gym by user email
  static async getStatsByEmail(email: string) {
    const gymId = await this.getGymIdByEmail(email);
     const totalincome = await db
    .select({ total: sum(payments.amount).as('total') })
    .from(payments)
    .where(eq(payments.gymId, gymId));
     const now = new Date();






const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);


const monthlyIncome = await db
  .select({ 
    total: sum(payments.amount).as('total') 
  })
  .from(payments)
  .where(
    and(
      eq(payments.gymId, gymId),
      gte(payments.paidAt, firstDayOfMonth),
      lt(payments.paidAt, firstDayOfNextMonth)
    )
  );

    const ActiveMembers = await db
    .select({ memberId: payments.memberId })
    .from(payments)
    .innerJoin(members, eq(payments.memberId, members.id))
    .where(
      and(
        eq(payments.gymId, gymId),
        gt(payments.expiresAt, now)
      )
    )
    .groupBy(payments.memberId);

     const allMembers = await db
    .select()
    .from(members)
    .where(eq(members.gymId, gymId));


    const result = await db
    .select({
      id: payments.id,
      memberName: members.fullName,
      planName: members.plan,
      amount: payments.amount,
      paidAt: payments.paidAt,
      expiresAt: payments.expiresAt,
    })
    .from(payments)
    .innerJoin(members, eq(payments.memberId, members.id))
    .innerJoin(gym, and(eq(payments.gymId, gym.id), eq(gym.id, gymId)))
    .orderBy(desc(payments.paidAt)) 
    .limit(3); 

  const paymentsWithStatus = result.map((payment) => ({
    ...payment,
    status: new Date(payment.expiresAt) > new Date() ? 'paid' : 'unpaid',
  }));        

    return {
      totalincome:Number(totalincome[0]?.total ?? 0),
      monthlyIncome:Number(monthlyIncome[0]?.total ?? 0),
      ActiveMembers:ActiveMembers.length,
      allMembers:allMembers.length,
      recentPayments:paymentsWithStatus,
    }


  }

  // Update revenue by adding a given amount
  static async updateRevenue(email: string, amount: number) {
    const gymId = await this.getGymIdByEmail(email);

    const existing = await db
      .select({ revenue: gym.revenue })
      .from(gym)
      .where(eq(gym.id, gymId))
      .limit(1)
      .then(res => res[0]);

    const currentRevenue = parseFloat(existing?.revenue || '0');
    const newRevenue = currentRevenue + amount;

    await db
      .update(gym)
      .set({ revenue: newRevenue.toFixed(2) })
      .where(eq(gym.id, gymId));
  }

  // Recalculate gym stats from DB data
  static async recalculateStatsFromDB(email: string) {
    const gymId = await this.getGymIdByEmail(email);

    // Members
    const memberCount = await db
      .select()
      .from(members)
      .where(eq(members.gymId, gymId))
      .then(res => res.length);

    const activeMemberCount = await db
      .select()
      .from(members)
      .where(eq(members.gymId, gymId))
      .then(res => res.filter(m => m.isActive).length);

    // Subscriptions
    const activeSubsCount = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.gymId, gymId))
      .then(res => res.filter(s => s.isActive).length);

    // Revenue from payments
    const totalRevenue = await db
      .select()
      .from(payments)
      .where(eq(payments.gymId, gymId))
      .then(rows => rows.reduce((acc, row) => acc + Number(row.amount || 0), 0));

    // Update gym stats
    await db
      .update(gym)
      .set({
        totalMembers: memberCount,
        activeMembers: activeMemberCount,
        activeSubscriptions: activeSubsCount,
        revenue: totalRevenue.toFixed(2),
      })
      .where(eq(gym.id, gymId));
  }
}
