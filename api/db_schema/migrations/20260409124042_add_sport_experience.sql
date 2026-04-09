-- migrate:up
ALTER TABLE `sports`
  ADD COLUMN `experienced_limit` int DEFAULT NULL
    COMMENT '経験者上限' AFTER `image_id`;

CREATE TABLE `sport_experiences` (
  `user_id` VARCHAR(26) NOT NULL COMMENT 'ユーザーID',
  `sport_id` VARCHAR(26) NOT NULL COMMENT 'スポーツID',
  PRIMARY KEY (`user_id`, `sport_id`),
  KEY `sport_id` (`sport_id`),
  FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `sport_experiences`;
ALTER TABLE `sports` DROP COLUMN `experienced_limit`;
