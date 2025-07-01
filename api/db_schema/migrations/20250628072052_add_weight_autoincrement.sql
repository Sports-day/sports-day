-- migrate:up
ALTER TABLE sports MODIFY weight INT NOT NULL AUTO_INCREMENT COMMENT '表示順';

-- migrate:down
ALTER TABLE sports MODIFY weight INT NOT NULL COMMENT '表示順';
