-- migrate:up
CREATE TABLE `promotion_rules` (
  `id` varchar(26) NOT NULL COMMENT 'ID',
  `source_competition_id` varchar(26) NOT NULL COMMENT '進出元大会ID',
  `target_competition_id` varchar(26) NOT NULL COMMENT '進出先大会ID',
  `rank_spec` varchar(100) NOT NULL COMMENT '進出対象順位',
  `slot_start` int DEFAULT NULL COMMENT 'スロット開始位置',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_promotion_source` FOREIGN KEY (`source_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_target` FOREIGN KEY (`target_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `promotion_rules`;
