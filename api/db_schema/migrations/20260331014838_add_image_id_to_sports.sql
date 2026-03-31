-- migrate:up
ALTER TABLE sports ADD COLUMN image_id VARCHAR(26) NULL;
ALTER TABLE sports ADD CONSTRAINT fk_sports_image_id
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE sports DROP FOREIGN KEY fk_sports_image_id;
ALTER TABLE sports DROP COLUMN image_id;
