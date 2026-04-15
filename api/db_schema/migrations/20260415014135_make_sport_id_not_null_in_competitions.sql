-- migrate:up
-- sport_id が NULL の competitions を削除する（関連データは FK CASCADE で自動削除）
-- 対象: competition_entries, leagues, matches, match_entries, judgments,
--       tournaments, tournament_slots, promotion_rules
DELETE FROM competitions WHERE sport_id IS NULL;

-- sport_id を NOT NULL に変更
ALTER TABLE competitions
  MODIFY COLUMN sport_id VARCHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '競技ID';

-- migrate:down
ALTER TABLE competitions
  MODIFY COLUMN sport_id VARCHAR(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '競技ID';
