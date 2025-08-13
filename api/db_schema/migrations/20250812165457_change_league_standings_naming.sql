-- migrate:up
ALTER TABLE league_standings
  DROP INDEX idx_comp_standings,
  CHANGE COLUMN gf goals_for INT NOT NULL DEFAULT 0 COMMENT '総得点',
  CHANGE COLUMN ga goals_against INT NOT NULL DEFAULT 0 COMMENT '総失点',
  DROP COLUMN gd,
  ADD COLUMN goal_diff INT AS (goals_for - goals_against) STORED NOT NULL COMMENT '得失点差' AFTER goals_against,
  ADD INDEX idx_comp_standings (id, points DESC, goal_diff DESC, goals_for DESC);

-- migrate:down
ALTER TABLE league_standings
  DROP INDEX idx_comp_standings,
  CHANGE COLUMN goals_for gf INT NOT NULL DEFAULT 0 COMMENT '総得点',
  CHANGE COLUMN goals_against ga INT NOT NULL DEFAULT 0 COMMENT '総失点',
  DROP COLUMN goal_diff,
  ADD COLUMN gd INT AS (gf - ga) STORED NOT NULL COMMENT '得失点差' AFTER ga,
  ADD INDEX idx_comp_standings (id, points DESC, gd DESC, gf DESC);
