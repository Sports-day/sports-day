-- migrate:up
CREATE TABLE leagues (
  id VARCHAR(26) NOT NULL COMMENT '大会ID',
  calculation_type VARCHAR(16) NOT NULL DEFAULT 'WIN_SCORE' COMMENT '採点方式',
  win_pt  INT NOT NULL DEFAULT 3 COMMENT '勝ち点',
  draw_pt INT NOT NULL DEFAULT 1 COMMENT '引き分け点',
  lose_pt INT NOT NULL DEFAULT 0 COMMENT '負け点',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_league_competition FOREIGN KEY (id) REFERENCES competitions(id) ON DELETE CASCADE,
  CONSTRAINT chk_leagues_calc_type CHECK (calculation_type IN ('TOTAL_SCORE','DIFF_SCORE','WIN_SCORE'))
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

CREATE TABLE league_standings (
  id  VARCHAR(26) NOT NULL COMMENT '大会ID',
  team_id    VARCHAR(26) NOT NULL COMMENT 'チームID',
  win        INT  NOT NULL DEFAULT 0 COMMENT '勝利数',
  draw       INT NOT NULL DEFAULT 0 COMMENT '引き分け数',
  lose       INT NOT NULL DEFAULT 0 COMMENT '敗北数',
  gf         INT  NOT NULL DEFAULT 0 COMMENT '総得点',
  ga         INT  NOT NULL DEFAULT 0 COMMENT '総失点',
  gd         INT  AS (gf - ga) STORED COMMENT '得失点差',
  points     INT NOT NULL DEFAULT 0 COMMENT '勝点',
  `rank`     INT  NOT NULL DEFAULT 0 COMMENT '順位',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, team_id),
  CONSTRAINT fk_ls_league  FOREIGN KEY (id) REFERENCES leagues(id),
  CONSTRAINT fk_ls_team    FOREIGN KEY (team_id)   REFERENCES teams(id),
  INDEX idx_comp_rank (id, `rank`),
  INDEX idx_comp_standings (id, points DESC, gd DESC, gf DESC)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;
-- migrate:down
DROP TABLE leagues;
DROP TABLE league_standings;