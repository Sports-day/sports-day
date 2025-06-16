-- migrate:up
CREATE TABLE `sports`
(
    id      VARCHAR(26)  NOT NULL COMMENT 'ID',
    name    VARCHAR(64)  NOT NULL COMMENT 'スポーツ名',
    weight  INT UNSIGNED  NOT NULL COMMENT '表示順',
    icon_id VARCHAR(26)  NOT NULL COMMENT 'アイコンID',
    rule_id VARCHAR(26)  NOT NULL COMMENT 'ルールID',
    PRIMARY KEY (id),
    FOREIGN KEY (icon_id) REFERENCES icons(id) ON DELETE CASCADE,
    FOREIGN KEY (rule_id) REFERENCES rules(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `sports`;
