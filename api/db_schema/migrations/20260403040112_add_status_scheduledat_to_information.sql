-- migrate:up
ALTER TABLE `information`
  ADD COLUMN `status` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'draft' COMMENT 'ステータス' AFTER `content`,
  ADD COLUMN `scheduled_at` datetime NULL COMMENT '公開予約日時' AFTER `status`;

-- migrate:down
ALTER TABLE `information`
  DROP COLUMN `scheduled_at`,
  DROP COLUMN `status`;
