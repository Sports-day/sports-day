-- migrate:up
CREATE TABLE `tournament_slots` (
  `id`               VARCHAR(26)  NOT NULL COMMENT 'ID',
  `tournament_id`    VARCHAR(26)  NOT NULL COMMENT 'ブラケットID',
  `match_entry_id`   VARCHAR(26)  NOT NULL COMMENT '対応するmatch_entries.id',
  `slot_position`    TINYINT      NOT NULL COMMENT 'スロット位置 (1 or 2)',
  `source_type`      VARCHAR(16)  NOT NULL COMMENT 'ソース種別',
  `source_match_id`  VARCHAR(26)  NULL     COMMENT 'ソース試合ID',
  `seed_number`      INT          NULL     COMMENT 'シード番号 (SEED時)',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_ts_tournament`
    FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_match_entry`
    FOREIGN KEY (`match_entry_id`) REFERENCES `match_entries`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_source_match`
    FOREIGN KEY (`source_match_id`) REFERENCES `matches`(`id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_ts_source_type`
    CHECK (`source_type` IN ('SEED', 'MATCH_WINNER', 'MATCH_LOSER')),
  CONSTRAINT `chk_ts_slot_position`
    CHECK (`slot_position` IN (1, 2)),
  UNIQUE KEY `uidx_ts_match_entry` (`match_entry_id`),
  UNIQUE KEY `uidx_ts_seed` (`tournament_id`, `seed_number`),
  INDEX `idx_ts_source_match` (`source_match_id`),
  INDEX `idx_ts_tournament` (`tournament_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `tournament_slots`;
