CREATE TABLE `satisfaction_surveys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`rating` int NOT NULL,
	`feedback` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `satisfaction_surveys_id` PRIMARY KEY(`id`)
);
