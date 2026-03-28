-- migrate:up
CREATE TABLE `tiebreak_priorities` (
  `league_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'リーグID',
  `team_id` VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  `priority` INT NOT NULL COMMENT '同順位チーム内での優先度',
  PRIMARY KEY (`league_id`, `team_id`),
  CONSTRAINT `fk_tiebreak_priorities_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tiebreak_priorities_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `tiebreak_priorities`;

