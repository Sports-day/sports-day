-- migrate:up
CREATE TABLE `tournaments` (
  `id` VARCHAR(26) NOT NULL COMMENT 'ID',
  `competition_id` VARCHAR(26) NOT NULL COMMENT '大会ID',
  `name` VARCHAR(64) NOT NULL COMMENT 'ブラケット名',
  `bracket_type` VARCHAR(16) NOT NULL DEFAULT 'MAIN' COMMENT 'ブラケット種別',
  `placement_method` VARCHAR(16) DEFAULT NULL COMMENT '配置方式',
  `display_order` INT NOT NULL DEFAULT 1 COMMENT '表示順',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tournaments_competition` (`competition_id`),
  CONSTRAINT `fk_tournaments_competition` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `tournaments`;
