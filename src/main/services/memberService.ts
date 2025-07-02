import { db } from '../db';
import { members } from '../db/schema';
import { eq, and, gt, lt } from 'drizzle-orm';

export class MemberService {
  static async createMember(data: {
    id:number;
    gymId: number;
    fullName: string;
    serialNumber: string;
    phone?: string;
    email?: string;
    pfpUrl?: string;
    plan: string;
    subscriptionStart?: Date;
    subscriptionEnd?: Date;
  }) {
    return await db.insert(members).values({
      id:data.id,
      gymId: data.gymId,
      fullName: data.fullName,
      serialNumber: data.serialNumber,
      phone: data.phone,
      email: data.email,
      pfpUrl: data.pfpUrl,
      plan: data.plan,
      subscriptionStart: data.subscriptionStart,
      subscriptionEnd: data.subscriptionEnd,
    }).returning();
  }

  static async getAllMembers(gymId: number) {
    const rows = await db.select().from(members).where(eq(members.gymId, gymId));
return rows.map((row) => ({
  id: row.id,
  gymId: row.gymId,
  fullName: row.fullName,
  serialNumber: row.serialNumber,
  phone: row.phone,
  email: row.email,
  pfpUrl: row.pfpUrl,
  plan: row.plan,
  subscriptionStart: row.subscriptionStart,
  subscriptionEnd: row.subscriptionEnd,
}));

  }

  static async getMemberById(id: number) {
    const result = await db.select().from(members).where(eq(members.id, id));
    return result[0];
  }

  static async getMemberBySerial(serialNumber: string) {
    const result = await db.select().from(members).where(eq(members.serialNumber, serialNumber));
    return result[0];
  }

  static async updateMember(
    id: number,
    updates: Partial<{
      fullName: string;
      phone: string;
      email: string;
      pfpUrl: string;
      plan: string;
      subscriptionStart: Date;
      subscriptionEnd: Date;
      isActive: boolean;
    }>
  ) {
    return await db
      .update(members)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
  }

  static async deleteMember(id: number) {
    return await db.delete(members).where(eq(members.id, id));
  }

  static async getActiveMembers(gymId: number) {
    return await db
      .select()
      .from(members)
      .where(and(eq(members.gymId, gymId), eq(members.isActive, true)));
  }

  static async deactivateMember(id: number) {
    return await db
      .update(members)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
  }

  static async activateMember(id: number) {
    return await db
      .update(members)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(members.id, id))
      .returning();
  }

  static async getMembersWithExpiredSubscriptions(gymId: number) {
    return await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.gymId, gymId),
          lt(members.subscriptionEnd, new Date())
        )
      );
  }

  static async getMembersWithUpcomingExpirations(gymId: number, days = 7) {
    const now = new Date();
    const soon = new Date();
    soon.setDate(now.getDate() + days);

    return await db
      .select()
      .from(members)
      .where(
        and(
          eq(members.gymId, gymId),
          gt(members.subscriptionEnd, now),
          lt(members.subscriptionEnd, soon)
        )
      );
  }
}
