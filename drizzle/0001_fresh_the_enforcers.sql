CREATE TABLE `pcb_comments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pcb_comments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pcb_likes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pcb_likes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pcb_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` text,
	`tags` text,
	`imageUrl` text NOT NULL,
	`imageKey` varchar(512) NOT NULL,
	`layers` int,
	`software` varchar(128),
	`category` varchar(64),
	`likesCount` int NOT NULL DEFAULT 0,
	`commentsCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pcb_projects_id` PRIMARY KEY(`id`)
);
