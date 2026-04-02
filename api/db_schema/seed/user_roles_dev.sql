-- =============================================================================
-- 開発環境専用シード: user_roles テーブルの初期データ
-- 警告: このファイルは開発環境専用です。本番環境では絶対に実行しないこと。
-- =============================================================================

-- 最初の admin ユーザーを直接 INSERT する。
-- sub の値は Keycloak に登録済みユーザーの JWT sub claim (UUID) に置き換えること。
-- 確認方法: ブラウザでログイン後、ネットワークタブで JWT をデコードして sub claim を取得する。
-- または Keycloak 管理画面 → Users → 対象ユーザー → Attributes で確認する。
INSERT IGNORE INTO user_roles (sub, role) VALUES
  ('{REPLACE_WITH_KEYCLOAK_USER_SUB}', 'admin');

-- 複数ユーザーを登録する場合は以下のようにカンマ区切りで追加できる:
-- INSERT IGNORE INTO user_roles (sub, role) VALUES
--   ('{ADMIN_USER_SUB}', 'admin'),
--   ('{ORGANIZER_USER_SUB}', 'organizer');
