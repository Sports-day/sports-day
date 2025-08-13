-- migrate:up
ALTER TABLE `competitions`
  DROP FOREIGN KEY `fk_competitions_default_location`;

ALTER TABLE `competitions`
  DROP COLUMN `default_location_id`;

-- migrate:down
ALTER TABLE `competitions`
  ADD COLUMN default_location_id VARCHAR(26) NULL COMMENT '既定の会場';

ALTER TABLE `competitions`
  ADD CONSTRAINT `fk_competitions_default_location` FOREIGN KEY (default_location_id) REFERENCES `locations`(`id`) ON UPDATE CASCADE ON DELETE SET NULL;
