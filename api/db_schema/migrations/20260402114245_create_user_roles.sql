-- migrate:up
CREATE TABLE IF NOT EXISTS `user_roles` (
  `sub`        VARCHAR(255) NOT NULL COMMENT 'JWT sub claim（IdP識別子）',
  `role`       VARCHAR(50)  NOT NULL COMMENT 'ロール識別子（admin / organizer / participant）',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `user_roles`;
