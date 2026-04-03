-- migrate:up
ALTER TABLE `information` ADD CONSTRAINT `chk_information_status` CHECK (`status` IN ('draft', 'published', 'scheduled'));

-- migrate:down
ALTER TABLE `information` DROP CHECK `chk_information_status`;
