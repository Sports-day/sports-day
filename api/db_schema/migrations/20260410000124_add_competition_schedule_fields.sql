-- migrate:up
ALTER TABLE `competitions`
  ADD COLUMN `start_time` DATETIME NULL COMMENT 'スケジュール開始時刻' AFTER `sport_id`,
  ADD COLUMN `match_duration` INT NULL COMMENT '試合時間（分）' AFTER `start_time`,
  ADD COLUMN `break_duration` INT NULL COMMENT '休憩時間（分）' AFTER `match_duration`;

ALTER TABLE `matches`
  ADD COLUMN `time_manual` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '手動設定フラグ' AFTER `winner_team_id`;

-- migrate:down
ALTER TABLE `matches` DROP COLUMN `time_manual`;
ALTER TABLE `competitions` DROP COLUMN `break_duration`, DROP COLUMN `match_duration`, DROP COLUMN `start_time`;
