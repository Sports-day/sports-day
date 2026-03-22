-- migrate:up
CREATE TABLE sport_entries (
    id VARCHAR(26) NOT NULL,
    sport_scene_id VARCHAR(26) NOT NULL COMMENT 'スポーツとシーンの中間テーブルID',
    team_id VARCHAR(26) NOT NULL COMMENT 'チームID',
    FOREIGN KEY(sport_scene_id) REFERENCES sport_scene(id),
    FOREIGN KEY(team_id) REFERENCES teams(id)
)ENGINE = InnoDB
 DEFAULT CHARSET = utf8mb4
 COLLATE = utf8mb4_bin;

-- migrate:down
DROP TABLE sport_entries;

