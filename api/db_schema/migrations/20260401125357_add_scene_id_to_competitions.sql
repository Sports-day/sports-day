-- migrate:up
ALTER TABLE competitions
  ADD COLUMN scene_id VARCHAR(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'シーンID' AFTER type,
  ADD CONSTRAINT fk_competitions_scene FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE RESTRICT;

-- migrate:down
ALTER TABLE competitions
  DROP FOREIGN KEY fk_competitions_scene,
  DROP COLUMN scene_id;
