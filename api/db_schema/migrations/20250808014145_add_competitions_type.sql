-- migrate:up
ALTER TABLE `competitions`
  ADD COLUMN type VARCHAR(16) NOT NULL DEFAULT 'LEAGUE' COMMENT '大会種別' AFTER `name`,
  ADD CONSTRAINT `chk_competitions_type`
    CHECK (type IN ('LEAGUE','TOURNAMENT'));
-- migrate:down
ALTER TABLE `competitions`
  DROP CONSTRAINT `chk_competitions_type`,
  DROP COLUMN type;
