-- migrate:up

CREATE TABLE `rules` 
(
    id         VARCHAR(26) NOT NULL COMMENT 'ID',
    rule       TEXT        NOT NULL COMMENT 'ルール',
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `rules`;