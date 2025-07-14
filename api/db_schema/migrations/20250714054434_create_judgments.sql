-- migrate:up
CREATE TABLE `judgments` (
  id VARCHAR(26) NOT NULL COMMENT '試合ID',
  name VARCHAR(64) NOT NULL COMMENT '名前',
  user_id VARCHAR(26) NULL COMMENT 'ユーザーID',
  team_id VARCHAR(26) NULL COMMENT 'チームID',
  group_id VARCHAR(26) NULL COMMENT 'グループID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uidx_name_on_match (id, name),
  CONSTRAINT fk_judgments_match FOREIGN KEY (id) REFERENCES matches(id) ON DELETE CASCADE,
  CONSTRAINT fk_judgments_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_judgments_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  CONSTRAINT fk_judgments_group FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  CONSTRAINT chk_judgments_entry CHECK ((user_id IS NOT NULL) + (team_id IS NOT NULL) + (group_id IS NOT NULL) = 1)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `judgments`;
