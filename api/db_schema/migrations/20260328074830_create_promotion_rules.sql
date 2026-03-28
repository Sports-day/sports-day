-- migrate:up
CREATE TABLE `promotion_rules` (
  `id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT '主キー',
  `source_competition_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT '進出元の大会ID',
  `target_competition_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT '進出先の大会ID',
  `rank_spec` VARCHAR(64) COLLATE utf8mb4_bin NOT NULL COMMENT '進出対象順位',
  `slot` INT DEFAULT NULL COMMENT 'スロット位置',
  PRIMARY KEY (`id`),
  KEY `fk_promotion_rules_source` (`source_competition_id`),
  KEY `fk_promotion_rules_target` (`target_competition_id`),
  CONSTRAINT `fk_promotion_rules_source` FOREIGN KEY (`source_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_rules_target` FOREIGN KEY (`target_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `promotion_rules`;

