-- migrate:up
ALTER TABLE `competitions`
  ADD COLUMN `default_location_id` varchar(26) COLLATE utf8mb4_bin NULL COMMENT 'デフォルト場所ID' AFTER `break_duration`,
  ADD CONSTRAINT `fk_competitions_default_location` FOREIGN KEY (`default_location_id`) REFERENCES `locations` (`id`) ON DELETE SET NULL;

ALTER TABLE `matches`
  ADD COLUMN `location_manual` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '場所手動設定フラグ' AFTER `time_manual`;

-- migrate:down
ALTER TABLE `matches` DROP COLUMN `location_manual`;
ALTER TABLE `competitions` DROP FOREIGN KEY `fk_competitions_default_location`;
ALTER TABLE `competitions` DROP COLUMN `default_location_id`;
