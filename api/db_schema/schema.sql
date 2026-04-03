/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `competition_entries`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competition_entries` (
  `competition_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '大会ID',
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  PRIMARY KEY (`competition_id`,`team_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `competition_entries_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `competition_entries_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `competitions`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competitions` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '主キー',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '大会名',
  `type` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'LEAGUE' COMMENT '大会種別',
  `sport_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '競技ID',
  `scene_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'シーンID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_competitions_scene` (`scene_id`),
  KEY `fk_competitions_sport` (`sport_id`),
  CONSTRAINT `fk_competitions_scene` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_competitions_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`),
  CONSTRAINT `chk_competitions_type` CHECK ((`type` in (_utf8mb4'LEAGUE',_utf8mb4'TOURNAMENT')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `group_users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `group_users` (
  `group_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'グループID',
  `user_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ユーザーID',
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `group_users_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE,
  CONSTRAINT `group_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `groups`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'グループ名',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `images`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'image id',
  `status` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'pending',
  `url` text COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `information`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `information` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `title` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'タイトル',
  `content` varchar(1000) COLLATE utf8mb4_bin NOT NULL COMMENT 'コメント',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT 'draft' COMMENT 'ステータス',
  `scheduled_at` datetime DEFAULT NULL COMMENT '公開予約日時',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `chk_information_status` CHECK ((`status` in (_utf8mb4'draft',_utf8mb4'published',_utf8mb4'scheduled')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `judgments`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `judgments` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '試合ID',
  `name` varchar(64) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '名前',
  `user_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ユーザーID',
  `team_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'チームID',
  `group_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'グループID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_judgments_user` (`user_id`),
  KEY `fk_judgments_team` (`team_id`),
  KEY `fk_judgments_group` (`group_id`),
  CONSTRAINT `fk_judgments_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_judgments_match` FOREIGN KEY (`id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_judgments_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_judgments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leagues`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leagues` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '大会ID',
  `win_pt` int NOT NULL DEFAULT '3' COMMENT '勝ち点',
  `draw_pt` int NOT NULL DEFAULT '1' COMMENT '引き分け点',
  `lose_pt` int NOT NULL DEFAULT '0' COMMENT '負け点',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_league_competition` FOREIGN KEY (`id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `locations`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `locations` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT '場所名',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `match_entries`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match_entries` (
  `id` char(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `match_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '試合ID',
  `team_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'チームID',
  `score` int NOT NULL DEFAULT '0' COMMENT '点数',
  PRIMARY KEY (`id`),
  KEY `idx_match_entries_match` (`match_id`),
  KEY `idx_match_entries_team` (`team_id`),
  CONSTRAINT `match_entries_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matches` (`id`) ON DELETE CASCADE,
  CONSTRAINT `match_entries_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `matches`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `time` datetime NOT NULL COMMENT '試合時間',
  `status` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'STANDBY' COMMENT '状態',
  `location_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '場所ID',
  `competition_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '大会ID',
  `winner_team_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '勝利チームID',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_match_location` (`location_id`),
  KEY `fk_match_competition` (`competition_id`),
  KEY `fk_match_winner_team` (`winner_team_id`),
  CONSTRAINT `fk_match_competition` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_location` FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_match_winner_team` FOREIGN KEY (`winner_team_id`) REFERENCES `teams` (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_matches_status` CHECK ((`status` in (_utf8mb4'CANCELED',_utf8mb4'STANDBY',_utf8mb4'ONGOING',_utf8mb4'FINISHED')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `promotion_rules`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_rules` (
  `id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '主キー',
  `source_competition_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '進出元の大会ID',
  `target_competition_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '進出先の大会ID',
  `rank_spec` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '進出対象順位',
  `slot` int DEFAULT NULL COMMENT 'スロット位置',
  PRIMARY KEY (`id`),
  KEY `fk_promotion_rules_source` (`source_competition_id`),
  KEY `fk_promotion_rules_target` (`target_competition_id`),
  CONSTRAINT `fk_promotion_rules_source` FOREIGN KEY (`source_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_promotion_rules_target` FOREIGN KEY (`target_competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ranking_rules`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ranking_rules` (
  `sport_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '競技ID',
  `condition_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '条件キー',
  `priority` int NOT NULL COMMENT '優先順位',
  PRIMARY KEY (`sport_id`,`condition_key`),
  UNIQUE KEY `uq_ranking_rules_sport_priority` (`sport_id`,`priority`),
  CONSTRAINT `fk_ranking_rules_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_ranking_rules_condition_key` CHECK ((`condition_key` in (_utf8mb4'WIN_POINTS',_utf8mb4'GOAL_DIFF',_utf8mb4'TOTAL_GOALS',_utf8mb4'HEAD_TO_HEAD',_utf8mb4'ADMIN_DECISION')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rules`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rules` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `rule` text COLLATE utf8mb4_bin NOT NULL COMMENT 'ルール',
  `sport_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '競技ID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_rules_sport` (`sport_id`),
  CONSTRAINT `fk_rules_sport` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `scenes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `scenes` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'シーン名',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '論理削除フラグ',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `schema_migrations`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schema_migrations` (
  `version` varchar(128) NOT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sport_entries`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_entries` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `sport_scene_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'スポーツとシーンの中間テーブルID',
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_sport_scene_team` (`sport_scene_id`,`team_id`),
  KEY `team_id` (`team_id`),
  CONSTRAINT `sport_entries_ibfk_1` FOREIGN KEY (`sport_scene_id`) REFERENCES `sport_scenes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_entries_ibfk_2` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sport_scenes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sport_scenes` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL,
  `scene_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'シーンID',
  `sport_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'スポーツID',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sport_id` (`sport_id`,`scene_id`),
  KEY `scene_id` (`scene_id`),
  CONSTRAINT `sport_scenes_ibfk_1` FOREIGN KEY (`sport_id`) REFERENCES `sports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sport_scenes_ibfk_2` FOREIGN KEY (`scene_id`) REFERENCES `scenes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `sports`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sports` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'スポーツ名',
  `weight` int NOT NULL COMMENT '表示順',
  `image_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_sports_image_id` (`image_id`),
  CONSTRAINT `fk_sports_image_id` FOREIGN KEY (`image_id`) REFERENCES `images` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `team_users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_users` (
  `team_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  `user_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ユーザーID',
  UNIQUE KEY `team_id` (`team_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `team_users_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE,
  CONSTRAINT `team_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'チーム名',
  `group_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'グループID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_teams_group` (`group_id`),
  CONSTRAINT `fk_teams_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tiebreak_priorities`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tiebreak_priorities` (
  `league_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'リーグID',
  `team_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'チームID',
  `priority` int NOT NULL COMMENT '同順位チーム内での優先度',
  PRIMARY KEY (`league_id`,`team_id`),
  KEY `fk_tiebreak_priorities_team` (`team_id`),
  CONSTRAINT `fk_tiebreak_priorities_league` FOREIGN KEY (`league_id`) REFERENCES `leagues` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_tiebreak_priorities_team` FOREIGN KEY (`team_id`) REFERENCES `teams` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tournament_slots`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournament_slots` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `tournament_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'トーナメントID',
  `match_entry_id` char(26) COLLATE utf8mb4_bin NOT NULL COMMENT '試合エントリーID',
  `source_type` varchar(16) COLLATE utf8mb4_bin NOT NULL COMMENT 'ソース種別',
  `source_match_id` varchar(26) COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ソース試合ID',
  `seed_number` int DEFAULT NULL COMMENT 'シード番号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uidx_ts_match_entry` (`match_entry_id`),
  UNIQUE KEY `uidx_ts_seed` (`tournament_id`,`seed_number`),
  KEY `idx_tournament_slots_tournament` (`tournament_id`),
  KEY `idx_tournament_slots_source_match` (`source_match_id`),
  CONSTRAINT `fk_ts_match_entry` FOREIGN KEY (`match_entry_id`) REFERENCES `match_entries` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ts_source_match` FOREIGN KEY (`source_match_id`) REFERENCES `matches` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_ts_tournament` FOREIGN KEY (`tournament_id`) REFERENCES `tournaments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tournaments`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tournaments` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `competition_id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT '大会ID',
  `name` varchar(64) COLLATE utf8mb4_bin NOT NULL COMMENT 'ブラケット名',
  `bracket_type` varchar(16) COLLATE utf8mb4_bin NOT NULL DEFAULT 'MAIN' COMMENT 'ブラケット種別',
  `placement_method` varchar(16) COLLATE utf8mb4_bin DEFAULT NULL COMMENT '配置方式',
  `display_order` int NOT NULL DEFAULT '1' COMMENT '表示順',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_tournaments_competition` (`competition_id`),
  CONSTRAINT `fk_tournaments_competition` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user_roles`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `sub` varchar(255) COLLATE utf8mb4_bin NOT NULL COMMENT 'JWT sub claim（IdP識別子）',
  `role` varchar(50) COLLATE utf8mb4_bin NOT NULL COMMENT 'ロール識別子（admin / organizer / participant）',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sub`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(26) COLLATE utf8mb4_bin NOT NULL COMMENT 'ID',
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'ユーザ名',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'メールアドレス',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users_idp`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_idp` (
  `user_id` varchar(26) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'User ID',
  `provider` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT 'プロバイダー名',
  `sub` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'OIDCユーザーの識別子',
  `microsoft_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'MicrosoftにおけるユーザーID(JWT oid)',
  `google_user_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'GoogleにおけるユーザーID',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uk_users_idp_sub` (`sub`),
  UNIQUE KEY `uk_users_idp_microsoft_user_id` (`microsoft_user_id`),
  UNIQUE KEY `uk_users_idp_google_user_id` (`google_user_id`),
  CONSTRAINT `fk_users_idp_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'sportsday'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed

--
-- Dbmate schema migrations
--

LOCK TABLES `schema_migrations` WRITE;
INSERT INTO `schema_migrations` (version) VALUES
  ('0000000000000'),
  ('20250128082113'),
  ('20250308135731'),
  ('20250419074124'),
  ('20250609082049'),
  ('20250616065704'),
  ('20250620080501'),
  ('20250624154957'),
  ('20250627090328'),
  ('20250708160648'),
  ('20250710092238'),
  ('20250712045125'),
  ('20250713042559'),
  ('20250713132558'),
  ('20250714054434'),
  ('20250714161756'),
  ('20250715135100'),
  ('20250807092310'),
  ('20250807141623'),
  ('20250807181501'),
  ('20250808014145'),
  ('20250810052214'),
  ('20250810090235'),
  ('20250811173350'),
  ('20250812165457'),
  ('20250813042405'),
  ('20260313073912'),
  ('20260315030117'),
  ('20260316170034'),
  ('20260318081057'),
  ('20260328074800'),
  ('20260328074809'),
  ('20260328074822'),
  ('20260328074830'),
  ('20260328074900'),
  ('20260328074910'),
  ('20260328133253'),
  ('20260328133325'),
  ('20260329151307'),
  ('20260331014838'),
  ('20260401125357'),
  ('20260402092244'),
  ('20260402092255'),
  ('20260402100214'),
  ('20260402100216'),
  ('20260402114245'),
  ('20260403040112'),
  ('20260403042217'),
  ('20260403050000');
UNLOCK TABLES;
