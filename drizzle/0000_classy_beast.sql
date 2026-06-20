CREATE TABLE `quote_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`quoteId` int NOT NULL,
	`originalName` varchar(512) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(128),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quote_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quote_requests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactName` varchar(128) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`contactPhone` varchar(64),
	`company` varchar(256),
	`pcbType` enum('pcb','fpc','rigid_flex','semi_test','other') NOT NULL DEFAULT 'pcb',
	`layers` int,
	`quantity` int,
	`boardWidth` decimal(8,2),
	`boardHeight` decimal(8,2),
	`boardThickness` decimal(6,2),
	`surfaceFinish` varchar(64),
	`material` varchar(128),
	`copperWeight` varchar(32),
	`services` text,
	`notes` text,
	`status` enum('pending','reviewing','quoted','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quote_requests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
