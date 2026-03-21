-- migrate:up
CREATE TABLE `admin_arbitrations` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `league_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'リーグID',
  `status` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'PENDING' COMMENT '状態',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_admin_arbitrations_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_admin_arbitrations_status` CHECK (`status` IN ('PENDING', 'RESOLVED'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

CREATE TABLE `admin_arbitration_entries` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `arbitration_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '裁定ID',
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  `resolved_rank` int DEFAULT NULL COMMENT '裁定順位',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_arbitration_team` (`arbitration_id`, `team_id`),
  CONSTRAINT `fk_arbitration_entries_arbitration` FOREIGN KEY (`arbitration_id`) REFERENCES `admin_arbitrations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_arbitration_entries_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `admin_arbitration_entries`;
DROP TABLE IF EXISTS `admin_arbitrations`;
