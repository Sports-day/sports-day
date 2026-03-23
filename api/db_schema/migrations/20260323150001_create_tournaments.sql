-- migrate:up
CREATE TABLE `tournaments` (
  `id`               VARCHAR(26)  NOT NULL COMMENT 'ID',
  `competition_id`   VARCHAR(26)  NOT NULL COMMENT '所属する大会ID',
  `name`             VARCHAR(64)  NOT NULL COMMENT 'ブラケット名',
  `bracket_type`     VARCHAR(16)  NOT NULL DEFAULT 'MAIN' COMMENT 'ブラケット種別',
  `display_order`    INT          NOT NULL DEFAULT 1 COMMENT 'UI上の表示順',
  `created_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_tournament_competition`
    FOREIGN KEY (`competition_id`) REFERENCES `competitions`(`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_tournament_bracket_type`
    CHECK (`bracket_type` IN ('MAIN', 'SUB')),
  INDEX `idx_tournament_competition` (`competition_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `tournaments`;
