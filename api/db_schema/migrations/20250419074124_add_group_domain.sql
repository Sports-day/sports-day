-- migrate:up
CREATE TABLE `groups` (
    id          VARCHAR(26) NOT NULL COMMENT 'ID',
    name        VARCHAR(64) NOT NULL COMMENT 'グループ名',
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE `group_users` (
    group_id VARCHAR(26) NOT NULL COMMENT 'グループID',
    user_id VARCHAR(26) NOT NULL COMMENT 'ユーザーID',
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;
  
-- migrate:down
DROP TABLE `group_users`;
DROP TABLE `groups`;
