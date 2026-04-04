-- =============================================================================
-- 開発環境専用シード: user_roles テーブルの初期データ
-- 警告: このファイルは開発環境専用です。本番環境では絶対に実行しないこと。
-- =============================================================================

-- 最初の admin ユーザーを直接 INSERT する。
-- user_id の値は users テーブルに登録済みユーザーの ID（ULID）に置き換えること。
INSERT IGNORE INTO user_roles (user_id, role) VALUES
  ('{REPLACE_WITH_USER_ID}', 'admin');

-- 複数ユーザーを登録する場合は以下のようにカンマ区切りで追加できる:
-- INSERT IGNORE INTO user_roles (user_id, role) VALUES
--   ('{ADMIN_USER_ID}', 'admin'),
--   ('{ORGANIZER_USER_ID}', 'organizer');
