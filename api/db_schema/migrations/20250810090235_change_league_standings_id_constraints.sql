-- migrate:up
ALTER TABLE league_standings
  DROP FOREIGN KEY fk_ls_league;

ALTER TABLE league_standings
  ADD CONSTRAINT fk_ls_league
  FOREIGN KEY (id) REFERENCES leagues(id)
  ON DELETE CASCADE;

-- migrate:down
ALTER TABLE league_standings
  DROP FOREIGN KEY fk_ls_league;

ALTER TABLE league_standings
  ADD CONSTRAINT fk_ls_league
  FOREIGN KEY (id) REFERENCES leagues(id);
