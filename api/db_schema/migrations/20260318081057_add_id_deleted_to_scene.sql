-- migrate:up
ALTER TABLE `scenes` 
  ADD COLUMN `is_deleted` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '論理削除フラグ';

-- migrate:down
ALTER TABLE `scenes` 
DROP COLUMN `is_deleted`;
