-- migrate:up
ALTER TABLE `users` DROP COLUMN `gender`;

-- migrate:down
ALTER TABLE `users` ADD COLUMN `gender` VARCHAR(10) NULL COMMENT '性別' AFTER `email`;
