-- migrate:up
CREATE TABLE `scenes` (
    id   VARCHAR(26) NOT NULL COMMENT 'ID',
    name VARCHAR(64) NOT NULL COMMENT 'シーン名',
    created_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB 
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_bin;

-- migrate:down

DROP TABLE `scenes`;