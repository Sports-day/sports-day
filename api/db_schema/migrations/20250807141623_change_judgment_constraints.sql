-- migrate:up
ALTER TABLE `judgments`
  DROP CHECK chk_judgments_entry,
  DROP FOREIGN KEY fk_judgments_user,
  DROP FOREIGN KEY fk_judgments_team,
  DROP FOREIGN KEY fk_judgments_group,
  DROP INDEX uidx_name_on_match;

ALTER TABLE `judgments`
  ADD CONSTRAINT fk_judgments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_judgments_team
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE SET NULL,
  ADD CONSTRAINT fk_judgments_group
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE SET NULL;

-- migrate:down
ALTER TABLE `judgments`
  DROP FOREIGN KEY fk_judgments_user,
  DROP FOREIGN KEY fk_judgments_team,
  DROP FOREIGN KEY fk_judgments_group;

ALTER TABLE `judgments`
  ADD CONSTRAINT chk_judgments_entry CHECK ((user_id IS NOT NULL) + (team_id IS NOT NULL) + (group_id IS NOT NULL) = 1),
  ADD CONSTRAINT fk_judgments_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_judgments_team
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
  ADD CONSTRAINT fk_judgments_group
    FOREIGN KEY (group_id) REFERENCES `groups`(id) ON DELETE CASCADE,
  ADD UNIQUE KEY uidx_name_on_match (id, name);
