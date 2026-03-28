-- migrate:up
CREATE TABLE `ranking_rules` (
  `sport_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT '競技ID',
  `condition_key` VARCHAR(32) COLLATE utf8mb4_bin NOT NULL COMMENT '条件キー',
  `priority` INT NOT NULL COMMENT '優先順位',
  PRIMARY KEY (`sport_id`, `condition_key`),
  UNIQUE KEY `uq_ranking_rules_sport_priority` (`sport_id`, `priority`),
  CONSTRAINT `fk_ranking_rules_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_ranking_rules_condition_key` CHECK (`condition_key` IN ('WIN_POINTS', 'GOAL_DIFF', 'TOTAL_GOALS', 'HEAD_TO_HEAD', 'ADMIN_DECISION'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `ranking_rules`;

