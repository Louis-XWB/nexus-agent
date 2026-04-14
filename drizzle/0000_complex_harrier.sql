CREATE TABLE `agent_actions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action_type` text NOT NULL,
	`reason` text NOT NULL,
	`amount` real,
	`token_from` text,
	`token_to` text,
	`tx_hash` text,
	`status` text NOT NULL,
	`confidence` real,
	`route` text,
	`route_details` text,
	`pnl` real,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `agent_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `chat_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL,
	`content` text NOT NULL,
	`tool_calls` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `intel_cache` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`type` text NOT NULL,
	`data` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `x402_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`endpoint` text NOT NULL,
	`payer_address` text NOT NULL,
	`amount` text NOT NULL,
	`tx_hash` text,
	`status` text NOT NULL,
	`created_at` integer NOT NULL
);
