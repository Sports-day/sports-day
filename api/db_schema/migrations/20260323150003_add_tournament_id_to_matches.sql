-- migrate:up
ALTER TABLE `matches`
  ADD COLUMN `tournament_id` VARCHAR(26) NULL COMMENT '所属ブラケットID（トーナメント用）',
  ADD CONSTRAINT `fk_match_tournament`
    FOREIGN KEY (`tournament_id`) REFERENCES `tournaments`(`id`) ON DELETE CASCADE,
  ADD INDEX `idx_match_tournament` (`tournament_id`);

-- migrate:down
ALTER TABLE `matches`
  DROP FOREIGN KEY `fk_match_tournament`,
  DROP INDEX `idx_match_tournament`,
  DROP COLUMN `tournament_id`;
