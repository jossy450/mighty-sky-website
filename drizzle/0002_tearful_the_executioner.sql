ALTER TABLE `customer_service_requests` ADD `priority` enum('high','medium','low') DEFAULT 'medium' NOT NULL;--> statement-breakpoint
ALTER TABLE `customer_service_requests` DROP COLUMN `answer`;