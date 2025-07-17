-- migrate:up
CREATE TABLE `sports`
(
    id      VARCHAR(26)  NOT NULL COMMENT 'ID',
    name    VARCHAR(64)  NOT NULL COMMENT 'スポーツ名',
    weight  INT          NOT NULL COMMENT '表示順',
    PRIMARY KEY (id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `sports`;
