-- migrate:up
ALTER TABLE `tournament_slots` DROP FOREIGN KEY `fk_ts_source_match`;
ALTER TABLE `tournament_slots` ADD CONSTRAINT `fk_ts_source_match` FOREIGN KEY (`source_match_id`) REFERENCES `matches` (`id`) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE `tournament_slots` DROP FOREIGN KEY `fk_ts_source_match`;
ALTER TABLE `tournament_slots` ADD CONSTRAINT `fk_ts_source_match` FOREIGN KEY (`source_match_id`) REFERENCES `matches` (`id`) ON DELETE RESTRICT;
