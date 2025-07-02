CREATE TABLE "gym" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"revenue" numeric(12, 2) DEFAULT '0',
	"total_members" integer DEFAULT 0,
	"active_members" integer DEFAULT 0,
	"active_subscriptions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "members" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_id" integer NOT NULL,
	"full_name" text NOT NULL,
	"serial_number" varchar(20) NOT NULL,
	"pfp_url" text,
	"phone" varchar(15),
	"email" varchar(255),
	"plan" text NOT NULL,
	"subscription_start" timestamp,
	"subscription_end" timestamp,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "members_serial_number_unique" UNIQUE("serial_number")
);
--> statement-breakpoint
CREATE TABLE "monthly_gym_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_id" integer NOT NULL,
	"month" date NOT NULL,
	"revenue" numeric(12, 2) DEFAULT '0',
	"active_members" integer DEFAULT 0,
	"total_members" integer DEFAULT 0,
	"active_subscriptions" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_id" integer NOT NULL,
	"member_id" integer NOT NULL,
	"amount" integer NOT NULL,
	"paid_at" timestamp DEFAULT now(),
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"gym_id" integer NOT NULL,
	"name" text NOT NULL,
	"price" integer NOT NULL,
	"duration_days" integer NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"member_id" integer NOT NULL,
	"gym_id" integer NOT NULL,
	"plan_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(64) NOT NULL,
	"username" varchar(64) NOT NULL,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'admin',
	"gym_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "members" ADD CONSTRAINT "members_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "monthly_gym_stats" ADD CONSTRAINT "monthly_gym_stats_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plans" ADD CONSTRAINT "plans_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_plan_id_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_gym_id_gym_id_fk" FOREIGN KEY ("gym_id") REFERENCES "public"."gym"("id") ON DELETE no action ON UPDATE no action;