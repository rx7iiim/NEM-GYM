import { db } from '../db';
import { payments, members, gym } from '../db/schema';
import { eq, and } from 'drizzle-orm';
import { GymService } from './gymStatsService';

export const paymentService = {

 async addPayment(data: {
  email: string;
  gymId: number;
  memberId: number;
  amount: number;
  expiresAt: string;
}) {
  
  await db.delete(payments).where(eq(payments.memberId, data.memberId));

  
  await db.insert(payments).values({
    gymId: data.gymId,
    memberId: data.memberId,
    amount: data.amount,
    expiresAt: new Date(data.expiresAt),
  });

 
  await GymService.updateRevenue(data.email, data.amount);

  return { success: true };
},


  async fetchPayments(email: string) {
    const gymid =await  GymService.getGymIdByEmail(email)
  
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
      .innerJoin(gym, and(eq(payments.gymId, gym.id), eq(gym.id, gymid)));

    const paymentsWithStatus = result.map((payment) => ({
      ...payment,
      status: new Date(payment.expiresAt) > new Date() ? 'paid' : 'unpaid',
    }));

    return paymentsWithStatus;
  },

  // Get single payment by ID
  async getPaymentById(id: number) {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  },

  // Update a payment
  async updatePayment(
    id: number,
    update: Partial<{ amount: number; expiresAt: string }>
  ) {
    await db
      .update(payments)
      .set({
        ...(update.amount !== undefined && { amount: update.amount }),
        ...(update.expiresAt && { expiresAt: new Date(update.expiresAt) }),
      })
      .where(eq(payments.id, id));

    return { success: true };
  },

  // Delete payment
  async deletePayment(id: number) {
    await db.delete(payments).where(eq(payments.id, id));
    return { success: true };
  },
};
