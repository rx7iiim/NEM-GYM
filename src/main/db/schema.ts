import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  varchar,
  decimal,
  date
} from 'drizzle-orm/pg-core'

/** GYM */
export const gym = pgTable('gym', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0'),
  totalMembers: integer('total_members').default(0),
  activeMembers: integer('active_members').default(0),
  activeSubscriptions: integer('active_subscriptions').default(0),
  createdAt: timestamp('created_at').defaultNow(),
})

/** USERS (Admin or staff) */
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 64 }).unique().notNull(),
  username: varchar('username', { length: 64 }).unique().notNull(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('admin'), // admin / staff
  gymId: integer('gym_id').references(() => gym.id).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

/** MEMBERS */
export const members = pgTable('members', {
  id: serial('id').primaryKey(),
  gymId: integer('gym_id').references(() => gym.id).notNull(),

  fullName: text('full_name').notNull(),
  serialNumber: varchar('serial_number', { length: 20 }),
  pfpUrl: text('pfp_url'),

  phone: varchar('phone', { length: 15 }),
  email: varchar('email', { length: 255 }),

  plan: text('plan').notNull(), // e.g. Monthly, Quarterly
  subscriptionStart: timestamp('subscription_start'),
  subscriptionEnd: timestamp('subscription_end'),
  isActive: boolean('is_active').default(true),

  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

/** PLANS */
export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  gymId: integer('gym_id').references(() => gym.id).notNull(),
  name: text('name').notNull(),
  price: integer('price').notNull(), // in DZD
  durationDays: integer('duration_days').notNull(), // e.g. 30
  description: text('description'),
})

/** PAYMENTS */
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
   gymId: integer('gym_id').references(() => gym.id).notNull(),
   memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
  amount: integer('amount').notNull(),
  paidAt: timestamp('paid_at').defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
notified: boolean('notified').default(false),
})

/** NOTIFICATIONS */
export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow(),
   memberId: integer('member_id').references(() => members.id, { onDelete: 'cascade' }).notNull(),
   paymentId: integer('payment_id').references(() => payments.id, { onDelete: 'cascade' }).notNull(),                                                             
})

/** MONTHLY GYM STATS */
export const monthlyGymStats = pgTable('monthly_gym_stats', {
  id: serial('id').primaryKey(),
  gymId: integer('gym_id').references(() => gym.id).notNull(),
  month: date('month').notNull(), // e.g. 2025-06-01

  revenue: decimal('revenue', { precision: 12, scale: 2 }).default('0'),
  activeMembers: integer('active_members').default(0),
  totalMembers: integer('total_members').default(0),
  activeSubscriptions: integer('active_subscriptions').default(0),

  createdAt: timestamp('created_at').defaultNow(),
})

/**SUBSCRIPTIONS Table */
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  memberId: integer('member_id').references(() => members.id).notNull(),
  gymId: integer('gym_id').references(() => gym.id).notNull(),
  planId: integer('plan_id').references(() => plans.id).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date').notNull(),
  isActive: boolean('is_active').default(true),
})
