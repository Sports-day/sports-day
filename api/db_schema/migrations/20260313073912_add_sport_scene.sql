-- migrate:up
CREATE TABLE sport_scene (
    id VARCHAR(26) PRIMARY KEY,
    scene_id VARCHAR(26) NOT NULL COMMENT 'シーンID',
    sport_id VARCHAR(26) NOT NULL COMMENT 'スポーツID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sport_id) REFERENCES sports(id) ON DELETE CASCADE,
    FOREIGN KEY (scene_id) REFERENCES scenes(id) ON DELETE CASCADE,
    UNIQUE (sport_id, scene_id)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE sport_scene;

