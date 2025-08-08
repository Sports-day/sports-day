-- migrate:up
ALTER TABLE match_entries
  ADD COLUMN id CHAR(26) NOT NULL COMMENT 'ID' FIRST,
  ADD INDEX idx_match_entries_match (match_id),
  ADD INDEX idx_match_entries_team  (team_id),
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (id),
  MODIFY team_id VARCHAR(26) NULL COMMENT 'チームID';

-- migrate:down
ALTER TABLE match_entries
  DROP PRIMARY KEY,
  MODIFY team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
  ADD PRIMARY KEY (match_id, team_id),
  DROP INDEX idx_match_entries_match,
  DROP INDEX idx_match_entries_team,
  DROP COLUMN id;
