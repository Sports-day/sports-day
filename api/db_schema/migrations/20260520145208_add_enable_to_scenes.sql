-- migrate:up
ALTER TABLE `scenes`
  ADD COLUMN `enable` tinyint(1) NOT NULL DEFAULT '1' COMMENT '有効フラグ';

-- migrate:down
ALTER TABLE `scenes`
  DROP COLUMN `enable`;
