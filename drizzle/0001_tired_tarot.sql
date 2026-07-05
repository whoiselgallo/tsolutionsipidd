CREATE TABLE `brand_assets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`assetType` enum('logo_svg','logo_png','logo_jpeg','mockup_png','mockup_jpeg','palette_json','typography_json','brand_guide_json','zip_bundle') NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`storageKey` text,
	`storageUrl` text,
	`fileSize` int,
	`isDownloaded` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brand_assets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brand_generations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`projectId` int NOT NULL,
	`userId` int NOT NULL,
	`generationType` enum('concept','naming','logo_svg','mockup','brand_guide','full') NOT NULL,
	`prompt` text,
	`result` text,
	`modelUsed` varchar(128),
	`tokensUsed` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `brand_generations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `brand_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`status` enum('draft','in_progress','completed') NOT NULL DEFAULT 'draft',
	`briefingData` json,
	`generatedConcept` text,
	`generatedNaming` text,
	`generatedLogoSvg` text,
	`generatedMockupUrl` text,
	`generatedBrandGuide` json,
	`selectedColors` json,
	`selectedTypography` json,
	`selectedGeometry` json,
	`selectedStyle` varchar(64),
	`currentStep` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `brand_projects_id` PRIMARY KEY(`id`)
);
