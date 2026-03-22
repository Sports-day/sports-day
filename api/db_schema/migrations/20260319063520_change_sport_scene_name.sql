-- migrate:up
ALTER TABLE sport_scene RENAME TO sport_scenes;

-- migrate:down
ALTER TABLE sport_scenes RENAME TO sport_scene;
