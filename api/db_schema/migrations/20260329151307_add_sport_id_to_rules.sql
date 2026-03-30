-- migrate:up
ALTER TABLE `rules`
  ADD COLUMN `sport_id` VARCHAR(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '競技ID' AFTER `rule`,
  ADD KEY `fk_rules_sport` (`sport_id`),
  ADD CONSTRAINT `fk_rules_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`);

-- migrate:down
ALTER TABLE `rules`
  DROP FOREIGN KEY `fk_rules_sport`,
  DROP KEY `fk_rules_sport`,
  DROP COLUMN `sport_id`;
