-- migrate:up
CREATE TABLE sport_entries (
    id VARCHAR(26) PRIMARY KEY,
    sport_scene_id VARCHAR(26) NOT NULL COMMENT 'スポーツとシーンの中間テーブルID',
    team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
    UNIQUE KEY uk_sport_scene_team (sport_scene_id, team_id),
    FOREIGN KEY(sport_scene_id) REFERENCES sport_scenes(id) ON DELETE CASCADE,
    FOREIGN KEY(team_id) REFERENCES teams(id) ON DELETE CASCADE
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4
 COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE sport_entries;

