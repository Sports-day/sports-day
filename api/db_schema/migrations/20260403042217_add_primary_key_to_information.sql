-- migrate:up
ALTER TABLE `information` ADD PRIMARY KEY (`id`);

-- migrate:down
ALTER TABLE `information` DROP PRIMARY KEY;
