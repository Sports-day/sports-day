-- migrate:up
CREATE TABLE IF NOT EXISTS `users_idp` (
  `user_id`           varchar(26) NOT NULL COMMENT 'User ID',
  `provider`          varchar(32) NOT NULL COMMENT 'プロバイダー名',
  `sub`               varchar(255) DEFAULT NULL COMMENT 'OIDCユーザーの識別子',
  `microsoft_user_id` varchar(255) DEFAULT NULL COMMENT 'MicrosoftにおけるユーザーID(JWT oid)',
  `google_user_id`    varchar(255) DEFAULT NULL COMMENT 'GoogleにおけるユーザーID',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_idp_sub` (`sub`),
  UNIQUE KEY `uk_users_idp_microsoft_user_id` (`microsoft_user_id`),
  UNIQUE KEY `uk_users_idp_google_user_id` (`google_user_id`),
  CONSTRAINT `fk_users_idp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

-- migrate:down
DROP TABLE IF EXISTS `users_idp`;
