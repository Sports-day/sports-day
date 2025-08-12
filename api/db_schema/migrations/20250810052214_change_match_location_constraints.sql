-- migrate:up
ALTER TABLE `matches`
  MODIFY COLUMN location_id VARCHAR(26) COMMENT '場所ID';


-- migrate:down
ALTER TABLE `matches`
  MODIFY COLUMN location_id VARCHAR(26) NOT NULL COMMENT '場所ID',
