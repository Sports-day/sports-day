-- migrate:up

-- league_standings テーブルを削除
DROP TABLE IF EXISTS `league_standings`;

-- leagues テーブルから calculation_type カラムを削除
ALTER TABLE `leagues`
  DROP CHECK `chk_leagues_calc_type`;

ALTER TABLE `leagues`
  DROP COLUMN `calculation_type`;

-- 順位決定ルールテーブル
CREATE TABLE `ranking_rules` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `league_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `condition_key` ENUM('WIN_POINTS', 'GOAL_DIFF', 'TOTAL_GOALS', 'HEAD_TO_HEAD', 'ADMIN_DECISION') NOT NULL,
  `priority` INT NOT NULL COMMENT '1始まり、小さい値ほど優先順位が高い',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_league_condition` (`league_id`, `condition_key`),
  UNIQUE KEY `uq_league_priority` (`league_id`, `priority`),
  CONSTRAINT `fk_ranking_rules_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- 管理者裁定テーブル
CREATE TABLE `admin_arbitrations` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `league_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `status` ENUM('PENDING', 'RESOLVED') NOT NULL DEFAULT 'PENDING',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_admin_arbitrations_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- 管理者裁定エントリーテーブル
CREATE TABLE `admin_arbitration_entries` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `arbitration_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `resolved_rank` INT NULL COMMENT 'NULL=未裁定, NOT NULL=裁定済みの絶対順位',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_arbitration_team` (`arbitration_id`, `team_id`),
  CONSTRAINT `fk_arbitration_entries_arbitration` FOREIGN KEY (`arbitration_id`) REFERENCES `admin_arbitrations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_arbitration_entries_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- 自動進出ルールテーブル
CREATE TABLE `promotion_rules` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `source_competition_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `target_competition_id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `rank_spec` varchar(100) COLLATE utf8mb4_bin NOT NULL COMMENT '進出対象順位の仕様: "1", "1,3", "1-4" 等',
  `slot_start` INT NULL COMMENT 'トーナメント進出時のスロット開始位置（リーグ進出時はNULL）',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_promotion_source` FOREIGN KEY (`source_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_target` FOREIGN KEY (`target_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down

-- 新規テーブルを削除（依存関係の逆順）
DROP TABLE IF EXISTS `promotion_rules`;
DROP TABLE IF EXISTS `admin_arbitration_entries`;
DROP TABLE IF EXISTS `admin_arbitrations`;
DROP TABLE IF EXISTS `ranking_rules`;

-- leagues テーブルに calculation_type カラムを再追加
ALTER TABLE `leagues`
  ADD COLUMN `calculation_type` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'WIN_SCORE' COMMENT '採点方式';

ALTER TABLE `leagues`
  ADD CONSTRAINT `chk_leagues_calc_type` CHECK (`calculation_type` IN ('TOTAL_SCORE', 'DIFF_SCORE', 'WIN_SCORE'));

-- league_standings テーブルを再作成
CREATE TABLE `league_standings` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '大会ID',
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
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
