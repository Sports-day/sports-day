-- migrate:up
CREATE TABLE `ranking_rules` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `league_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'リーグID',
  `condition_key` varchar(16) COLLATE utf8mb4_bin NOT NULL COMMENT '条件キー',
  `priority` int NOT NULL COMMENT '優先順位',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_league_condition` (`league_id`, `condition_key`),
  UNIQUE KEY `uq_league_priority` (`league_id`, `priority`),
  CONSTRAINT `fk_ranking_rules_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_ranking_rules_condition_key` CHECK (`condition_key` IN ('WIN_POINTS', 'GOAL_DIFF', 'TOTAL_GOALS', 'HEAD_TO_HEAD', 'ADMIN_DECISION'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `ranking_rules`;
