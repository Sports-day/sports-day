-- migrate:up
CREATE TABLE team_users (
  team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
  user_id VARCHAR(26) NOT NULL COMMENT 'ユーザーID',
  UNIQUE (team_id, user_id),
  FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE team_users;