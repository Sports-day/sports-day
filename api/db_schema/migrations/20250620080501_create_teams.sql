-- migrate:up
CREATE TABLE `teams` (
    id  VARCHAR(26) NOT NULL COMMENT 'ID',
    name VARCHAR(64) NOT NULL COMMENT 'チーム名',
    group_id VARCHAR(26) NOT NULL COMMENT 'グループID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_teams_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `teams`;
