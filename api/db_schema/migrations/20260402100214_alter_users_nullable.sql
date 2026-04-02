-- migrate:up
ALTER TABLE `users`
  MODIFY COLUMN `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ユーザ名',
  MODIFY COLUMN `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'メールアドレス';

-- migrate:down
ALTER TABLE `users`
  MODIFY COLUMN `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'ユーザ名',
  MODIFY COLUMN `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'メールアドレス';
