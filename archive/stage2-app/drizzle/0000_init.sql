CREATE TABLE "blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"ip_hash" text,
	"giver_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "blocks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "crate_tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crate_id" uuid NOT NULL,
	"track_id" uuid NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"source_slip_id" uuid,
	"added_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crate_tracks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "crates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "crates" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "events" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"user_id" uuid,
	"props" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"handle" text NOT NULL,
	"display_name" text NOT NULL,
	"bio" text,
	"accepting_slips" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "slips" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"board_owner_id" uuid NOT NULL,
	"crate_id" uuid,
	"track_id" uuid NOT NULL,
	"message" text NOT NULL,
	"giver_nickname" text NOT NULL,
	"giver_user_id" uuid,
	"receipt_token_hash" text NOT NULL,
	"ip_hash" text NOT NULL,
	"status" text DEFAULT 'unread' NOT NULL,
	"reaction" text,
	"opened_at" timestamp with time zone,
	"reacted_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "slips_receipt_token_hash_unique" UNIQUE("receipt_token_hash"),
	CONSTRAINT "slips_status_check" CHECK ("slips"."status" in ('unread', 'opened', 'hidden')),
	CONSTRAINT "slips_reaction_check" CHECK ("slips"."reaction" is null or "slips"."reaction" in ('fit', 'new', 'miss'))
);
--> statement-breakpoint
ALTER TABLE "slips" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tracks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text NOT NULL,
	"provider_track_id" text NOT NULL,
	"title" text NOT NULL,
	"artist" text NOT NULL,
	"album" text,
	"artwork_url" text,
	"preview_url" text,
	"duration_ms" integer,
	"source_url" text,
	"links" jsonb,
	"links_fetched_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tracks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blocks" ADD CONSTRAINT "blocks_giver_user_id_users_id_fk" FOREIGN KEY ("giver_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crate_tracks" ADD CONSTRAINT "crate_tracks_crate_id_crates_id_fk" FOREIGN KEY ("crate_id") REFERENCES "public"."crates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crate_tracks" ADD CONSTRAINT "crate_tracks_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crate_tracks" ADD CONSTRAINT "crate_tracks_source_slip_id_slips_id_fk" FOREIGN KEY ("source_slip_id") REFERENCES "public"."slips"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crates" ADD CONSTRAINT "crates_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slips" ADD CONSTRAINT "slips_board_owner_id_users_id_fk" FOREIGN KEY ("board_owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slips" ADD CONSTRAINT "slips_crate_id_crates_id_fk" FOREIGN KEY ("crate_id") REFERENCES "public"."crates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slips" ADD CONSTRAINT "slips_track_id_tracks_id_fk" FOREIGN KEY ("track_id") REFERENCES "public"."tracks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "slips" ADD CONSTRAINT "slips_giver_user_id_users_id_fk" FOREIGN KEY ("giver_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blocks_owner_idx" ON "blocks" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "crate_tracks_crate_track_key" ON "crate_tracks" USING btree ("crate_id","track_id");--> statement-breakpoint
CREATE INDEX "crates_owner_idx" ON "crates" USING btree ("owner_id","position");--> statement-breakpoint
CREATE INDEX "events_name_idx" ON "events" USING btree ("name","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_handle_key" ON "profiles" USING btree (lower("handle"));--> statement-breakpoint
CREATE INDEX "slips_board_owner_idx" ON "slips" USING btree ("board_owner_id","created_at");--> statement-breakpoint
CREATE INDEX "slips_ip_idx" ON "slips" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tracks_provider_track_key" ON "tracks" USING btree ("provider","provider_track_id");