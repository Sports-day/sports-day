-- migrate:up

CREATE TABLE `images`
(
    id          VARCHAR(26) NOT NULL COMMENT 'image id',
    status      VARCHAR(16) NOT NULL DEFAULT 'pending',
    url         TEXT,
    created_at  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    uploaded_at TIMESTAMP   NULL,
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
DEFAULT CHARSET = utf8mb4
COLLATE = utf8mb4_bin;

-- migrate:down

DROP TABLE `images`;