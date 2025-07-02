import { db } from '../db/index';
import { gym, users } from '../db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const createUser = async (
  email: string,
  username: string,
  password: string
) => {
  const passwordHash = await bcrypt.hash(password, 10);


  const [newGym] = await db.insert(gym)
    .values({
      name: `${username}'s Gym`,
      revenue: '0',
      totalMembers: 0,
      activeMembers: 0,
      activeSubscriptions: 0,
    })
    .returning({ id: gym.id });


  const [newUser] = await db.insert(users)
    .values({
      email,
      username,
      passwordHash,
      gymId: newGym.id,
    })
    .returning();

  return newUser;
};

export const getAllUsers = async () => {
  return await db.select().from(users);
};

export const getUserById = async (id: number) => {
  const result = await db.select().from(users).where(eq(users.id, id));
  return result[0];
};

export const getUserByEmail = async (email: string) => {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
};

export const updateUser = async (
  id: number,
  updates: Partial<{ username: string; password: string; role: string }>
) => {
  const fields: any = {};
  if (updates.username) fields.username = updates.username;
  if (updates.role) fields.role = updates.role;
  if (updates.password) {
    fields.passwordHash = await bcrypt.hash(updates.password, 10);
  }

  return await db.update(users).set(fields).where(eq(users.id, id)).returning();
};

export const deleteUser = async (id: number) => {
  return await db.delete(users).where(eq(users.id, id));
};
