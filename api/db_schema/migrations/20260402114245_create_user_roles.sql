-- migrate:up
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id`    VARCHAR(26)  NOT NULL COMMENT 'usersテーブルのID',
  `role`       VARCHAR(50)  NOT NULL COMMENT 'ロール識別子（admin / organizer / participant）',
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_user_roles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `user_roles`;
