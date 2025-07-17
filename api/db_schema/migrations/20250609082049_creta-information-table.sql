-- migrate:up
CREATE TABLE information(
    id varchar(26) NOT NULL COMMENT 'ID',
    title varchar(64) NOT NULL COMMENT 'タイトル',
    content varchar(1000) NOT NULL COMMENT 'コメント',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)ENGINE=InnoDB
 DEFAULT CHARSET=utf8mb4
 COLLATE=utf8mb4_bin;

-- migrate:down

DROP TABLE `information`;


