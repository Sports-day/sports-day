-- migrate:up
ALTER TABLE `leagues`
  DROP CHECK `chk_leagues_calc_type`;

ALTER TABLE `leagues`
  DROP COLUMN `calculation_type`;

-- migrate:down
ALTER TABLE `leagues`
  ADD COLUMN `calculation_type` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'WIN_SCORE' COMMENT '採点方式';

ALTER TABLE `leagues`
  ADD CONSTRAINT `chk_leagues_calc_type` CHECK (`calculation_type` IN ('TOTAL_SCORE', 'DIFF_SCORE', 'WIN_SCORE'));
