-- migrate:up
CREATE TABLE `tournament_slots` (
  `id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `tournament_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'トーナメントID',
  `match_entry_id` CHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT '試合エントリーID',
  `source_type` VARCHAR(16) COLLATE utf8mb4_bin NOT NULL COMMENT 'ソース種別',
  `source_match_id` VARCHAR(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ソース試合ID',
  `seed_number` INT DEFAULT NULL COMMENT 'シード番号',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uidx_ts_match_entry` (`match_entry_id`),
  UNIQUE KEY `uidx_ts_seed` (`tournament_id`, `seed_number`),
  KEY `idx_tournament_slots_tournament` (`tournament_id`),
  KEY `idx_tournament_slots_source_match` (`source_match_id`),
  CONSTRAINT `fk_ts_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_match_entry` FOREIGN KEY (`match_entry_id`) REFERENCES `match_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_source_match` FOREIGN KEY (`source_match_id`) REFERENCES `matches` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `tournament_slots`;
