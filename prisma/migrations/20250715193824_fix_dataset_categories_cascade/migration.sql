/*
  Warnings:

  - You are about to drop the column `category` on the `datasets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `datasets` DROP COLUMN `category`;

-- CreateTable
CREATE TABLE `dataset_categories` (
    `dataset_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,

    INDEX `category_id`(`category_id`),
    PRIMARY KEY (`dataset_id`, `category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dataset_access_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dataset_id` INTEGER NOT NULL,
    `field` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `name_UNIQUE`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dataset_tags_view` (
    `relation_id` VARCHAR(191) NOT NULL,
    `dataset_id` INTEGER NOT NULL,
    `tag_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`relation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dataset_categories_view` (
    `relation_id` VARCHAR(191) NOT NULL,
    `dataset_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`relation_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tag_usage_summary` (
    `tag_id` INTEGER NOT NULL,
    `tag_name` VARCHAR(191) NOT NULL,
    `usage_count` INTEGER NOT NULL,

    PRIMARY KEY (`tag_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category_usage_summary` (
    `category_id` INTEGER NOT NULL,
    `category_name` VARCHAR(191) NOT NULL,
    `usage_count` INTEGER NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dataset_categories` ADD CONSTRAINT `dataset_categories_ibfk_1` FOREIGN KEY (`dataset_id`) REFERENCES `datasets`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dataset_categories` ADD CONSTRAINT `dataset_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `dataset_access_info` ADD CONSTRAINT `dataset_access_info_dataset_id_fkey` FOREIGN KEY (`dataset_id`) REFERENCES `datasets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
