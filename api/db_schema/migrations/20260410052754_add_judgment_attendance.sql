-- migrate:up
ALTER TABLE `judgments`
  ADD COLUMN `is_attending` TINYINT(1) NOT NULL DEFAULT 0 AFTER `group_id`;

-- migrate:down
ALTER TABLE `judgments` DROP COLUMN `is_attending`;
