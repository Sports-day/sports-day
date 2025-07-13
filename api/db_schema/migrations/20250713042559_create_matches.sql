-- migrate:up
CREATE TABLE `matches` (
  id VARCHAR(26) NOT NULL COMMENT 'ID',
  time DATETIME NOT NULL COMMENT '試合時間',
  status VARCHAR(16) NOT NULL COMMENT '状態',
  location_id VARCHAR(26) NOT NULL COMMENT '場所ID',
  competition_id VARCHAR(26) NOT NULL COMMENT '大会ID',
  winner_team_id VARCHAR(26) COMMENT '勝利チームID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_match_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_competition FOREIGN KEY (competition_id) REFERENCES competitions(id) ON DELETE CASCADE,
  CONSTRAINT fk_match_winner_team FOREIGN KEY (winner_team_id) REFERENCES teams(id) ON DELETE SET NULL
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE `match_entries` (
  match_id VARCHAR(26) NOT NULL COMMENT '試合ID',
  team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
  score INT NOT NULL DEFAULT 0 COMMENT '点数',
  PRIMARY KEY (match_id, team_id),
  FOREIGN KEY (match_id) REFERENCES `matches`(id) ON DELETE CASCADE,
  FOREIGN KEY (team_id) REFERENCES `teams`(id) ON DELETE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE `match_entries`;
DROP TABLE `matches`;
