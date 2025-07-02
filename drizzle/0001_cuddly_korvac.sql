ALTER TABLE "members" DROP CONSTRAINT "members_serial_number_unique";--> statement-breakpoint
ALTER TABLE "payments" DROP CONSTRAINT "payments_member_id_members_id_fk";
--> statement-breakpoint
ALTER TABLE "members" ALTER COLUMN "serial_number" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "member_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "payment_id" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "notified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_member_id_members_id_fk" FOREIGN KEY ("member_id") REFERENCES "public"."members"("id") ON DELETE cascade ON UPDATE no action;