-- migrate:up
ALTER TABLE league_standings
  MODIFY COLUMN gd INT AS (gf - ga) STORED NOT NULL COMMENT '得失点差';

-- migrate:down
ALTER TABLE league_standings
  MODIFY COLUMN gd INT AS (gf - ga) STORED NULL COMMENT '得失点差';