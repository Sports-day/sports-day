-- migrate:up
CREATE TABLE `tiebreak_priorities` (
  `id` varchar(26) NOT NULL COMMENT 'ID',
  `league_id` varchar(26) NOT NULL COMMENT 'リーグID',
  `team_id` varchar(26) NOT NULL COMMENT 'チームID',
  `priority` int NOT NULL COMMENT 'タイブレーク優先度',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_league_team` (`league_id`, `team_id`),
  CONSTRAINT `fk_tiebreak_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tiebreak_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `tiebreak_priorities`;
