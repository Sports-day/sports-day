-- migrate:up
DROP TABLE IF EXISTS `league_standings`;

-- migrate:down
CREATE TABLE `league_standings` (
  `id` varchar(26) NOT NULL COMMENT '大会ID',
  `team_id` varchar(26) NOT NULL COMMENT 'チームID',
  `win` int NOT NULL DEFAULT '0' COMMENT '勝利数',
  `draw` int NOT NULL DEFAULT '0' COMMENT '引き分け数',
  `lose` int NOT NULL DEFAULT '0' COMMENT '敗北数',
  `goals_for` int NOT NULL DEFAULT '0' COMMENT '総得点',
  `goals_against` int NOT NULL DEFAULT '0' COMMENT '総失点',
  `goal_diff` int GENERATED ALWAYS AS ((`goals_for` - `goals_against`)) STORED NOT NULL COMMENT '得失点差',
  `points` int NOT NULL DEFAULT '0' COMMENT '勝点',
  `rank` int NOT NULL DEFAULT '0' COMMENT '順位',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`team_id`),
  KEY `fk_ls_team` (`team_id`),
  KEY `idx_comp_rank` (`id`,`rank`),
  KEY `idx_comp_standings` (`id`,`points` DESC,`goal_diff` DESC,`goals_for` DESC),
  CONSTRAINT `fk_ls_league` FOREIGN KEY (`id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ls_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
