-- migrate:up
ALTER TABLE `sports` CHANGE COLUMN `weight` `display_order` int NOT NULL COMMENT '表示順';

ALTER TABLE `competitions` ADD COLUMN `display_order` int NOT NULL DEFAULT 0 COMMENT '表示順' AFTER `default_location_id`;
ALTER TABLE `locations` ADD COLUMN `display_order` int NOT NULL DEFAULT 0 COMMENT '表示順' AFTER `name`;
ALTER TABLE `scenes` ADD COLUMN `display_order` int NOT NULL DEFAULT 0 COMMENT '表示順' AFTER `name`;
ALTER TABLE `information` ADD COLUMN `display_order` int NOT NULL DEFAULT 0 COMMENT '表示順' AFTER `status`;
ALTER TABLE `images` ADD COLUMN `display_order` int NOT NULL DEFAULT 0 COMMENT '表示順' AFTER `url`;

-- migrate:down
ALTER TABLE `sports` CHANGE COLUMN `display_order` `weight` int NOT NULL COMMENT '表示順';

ALTER TABLE `competitions` DROP COLUMN `display_order`;
ALTER TABLE `locations` DROP COLUMN `display_order`;
ALTER TABLE `scenes` DROP COLUMN `display_order`;
ALTER TABLE `information` DROP COLUMN `display_order`;
ALTER TABLE `images` DROP COLUMN `display_order`;
