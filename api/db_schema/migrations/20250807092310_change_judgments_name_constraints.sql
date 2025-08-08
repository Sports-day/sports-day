-- migrate:up
ALTER TABLE `judgments`
  MODIFY COLUMN name VARCHAR(64) COMMENT '名前';

-- migrate:down
ALTER TABLE `judgments`
  MODIFY COLUMN name VARCHAR(64) NOT NULL COMMENT '名前',