-- migrate:up
CREATE TABLE `locations` (
  id VARCHAR(26) NOT NULL COMMENT 'ID',
  name VARCHAR(64) NOT NULL COMMENT '場所名',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE (name)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `locations`;
