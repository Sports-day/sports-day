-- migrate:up

CREATE TABLE `images`
(
    id           VARCHAR(26)  NOT NULL COMMENT 'image id',
    object_key   VARCHAR(255) NOT NULL COMMENT 'rustfs object key',
    owner_type   VARCHAR(32)  NOT NULL COMMENT 'owner type',
    owner_id     VARCHAR(26)  NOT NULL COMMENT 'owner id',
    content_type VARCHAR(64)  NOT NULL COMMENT 'content type',
    created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_bin;

-- migrate:down

DROP TABLE `images`;