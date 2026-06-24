CREATE TABLE `activities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`leadId` int,
	`type` enum('call','email','meeting','wechat','demo','quote_sent','sample_sent','follow_up','note') NOT NULL DEFAULT 'note',
	`subject` varchar(256),
	`description` text,
	`performedBy` int,
	`occurredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`name` varchar(128) NOT NULL,
	`title` varchar(128),
	`email` varchar(320),
	`phone` varchar(64),
	`wechat` varchar(128),
	`linkedin` varchar(512),
	`isPrimary` boolean NOT NULL DEFAULT false,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `customers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(256) NOT NULL,
	`industry` varchar(128),
	`country` varchar(64),
	`city` varchar(128),
	`website` varchar(512),
	`notes` text,
	`stage` enum('prospect','active','vip','inactive','lost') NOT NULL DEFAULT 'prospect',
	`assignedTo` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `customers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`customerId` int NOT NULL,
	`invoiceNumber` varchar(64),
	`amount` decimal(12,2) NOT NULL,
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`taxAmount` decimal(12,2),
	`status` enum('draft','sent','partial','paid','overdue','cancelled') NOT NULL DEFAULT 'draft',
	`issuedAt` timestamp,
	`dueDate` timestamp,
	`paidAt` timestamp,
	`paymentMethod` varchar(128),
	`notes` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`customerId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`source` enum('website_quote','website_sample','referral','email','wechat','linkedin','exhibition','cold_call','other') NOT NULL DEFAULT 'website_quote',
	`status` enum('new','contacted','qualified','proposal','negotiation','won','lost') NOT NULL DEFAULT 'new',
	`estimatedValue` decimal(12,2),
	`assignedTo` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`originalName` varchar(512) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(128),
	`fileSize` int,
	`category` varchar(64),
	`uploadedBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `project_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`action` varchar(128) NOT NULL,
	`note` text,
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `project_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rfqId` int NOT NULL,
	`customerId` int NOT NULL,
	`projectNumber` varchar(64),
	`title` varchar(256) NOT NULL,
	`status` enum('planning','in_progress','review','on_hold','completed','cancelled') NOT NULL DEFAULT 'planning',
	`startDate` timestamp,
	`deadline` timestamp,
	`completedAt` timestamp,
	`assignedTo` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rfqId` int NOT NULL,
	`quoteNumber` varchar(64),
	`unitPrice` decimal(12,2),
	`totalPrice` decimal(12,2),
	`currency` varchar(8) NOT NULL DEFAULT 'USD',
	`leadTimeDays` int,
	`validUntil` timestamp,
	`paymentTerms` varchar(256),
	`deliveryTerms` varchar(128),
	`warranty` varchar(256),
	`notes` text,
	`status` enum('draft','sent','accepted','rejected','expired') NOT NULL DEFAULT 'draft',
	`createdBy` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rfq_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`rfqId` int NOT NULL,
	`originalName` varchar(512) NOT NULL,
	`fileKey` varchar(512) NOT NULL,
	`fileUrl` text NOT NULL,
	`mimeType` varchar(128),
	`fileSize` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rfq_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rfqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`leadId` int NOT NULL,
	`customerId` int NOT NULL,
	`rfqType` enum('standard_quote','free_sample') NOT NULL DEFAULT 'standard_quote',
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
	CONSTRAINT `rfqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `quote_requests` ADD `rfqId` int;