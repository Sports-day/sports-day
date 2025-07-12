-- migrate:up
CREATE TABLE `competitions` (
  id VARCHAR(26) NOT NULL COMMENT '主キー',
  name VARCHAR(64) NOT NULL COMMENT '大会名',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE `competition_entries` (
  competition_id VARCHAR(26) NOT NULL COMMENT '大会ID',
  team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
  PRIMARY KEY (competition_id, team_id),
  FOREIGN KEY (competition_id) REFERENCES `competitions`(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES `teams`(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `competition_entries`;
DROP TABLE `competitions`;
