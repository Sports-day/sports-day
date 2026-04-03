-- migrate:up
ALTER TABLE `information` DROP CHECK `chk_information_status`;
ALTER TABLE `information` DROP COLUMN `scheduled_at`;
ALTER TABLE `information` ADD CONSTRAINT `chk_information_status` CHECK (`status` IN ('draft', 'published'));

-- migrate:down
ALTER TABLE `information` DROP CHECK `chk_information_status`;
ALTER TABLE `information` ADD COLUMN `scheduled_at` DATETIME NULL;
ALTER TABLE `information` ADD CONSTRAINT `chk_information_status` CHECK (`status` IN ('draft', 'published', 'scheduled'));
