-- migrate:up
ALTER TABLE `users`
  MODIFY COLUMN `name` varchar(64) DEFAULT NULL COMMENT 'ユーザ名',
  MODIFY COLUMN `email` varchar(255) DEFAULT NULL COMMENT 'メールアドレス';

-- migrate:down
ALTER TABLE `users`
  MODIFY COLUMN `name` varchar(64) NOT NULL COMMENT 'ユーザ名',
  MODIFY COLUMN `email` varchar(255) NOT NULL COMMENT 'メールアドレス';
