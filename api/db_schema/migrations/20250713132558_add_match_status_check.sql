-- migrate:up
ALTER TABLE `matches`
  MODIFY COLUMN `status` VARCHAR(16) NOT NULL DEFAULT 'STANDBY' COMMENT '状態',
  ADD CONSTRAINT `chk_matches_status`
    CHECK (`status` IN (
      'CANCELED',
      'STANDBY',
      'ONGOING',
      'FINISHED'
    ));

-- migrate:down
ALTER TABLE `matches`
  DROP CHECK `chk_matches_status`,
  MODIFY COLUMN `status` VARCHAR(16) NOT NULL COMMENT '状態';
