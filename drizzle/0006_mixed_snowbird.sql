ALTER TABLE `users` ADD `age_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `consent_accepted_at` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `marketing_opt_in` boolean DEFAULT false NOT NULL;