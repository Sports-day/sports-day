-- migrate:up
ALTER TABLE `competitions`
  ADD COLUMN `sport_id` VARCHAR(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '競技ID' AFTER `type`,
  ADD KEY `fk_competitions_sport` (`sport_id`),
  ADD CONSTRAINT `fk_competitions_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

-- migrate:down
ALTER TABLE `competitions`
  DROP FOREIGN KEY `fk_competitions_sport`,
  DROP KEY `fk_competitions_sport`,
  DROP COLUMN `sport_id`;

