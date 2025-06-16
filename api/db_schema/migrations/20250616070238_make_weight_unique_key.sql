-- migrate:up
ALTER TABLE sports ADD CONSTRAINT unique_weight UNIQUE (weight);

-- migrate:down
ALTER TABLE sports DROP CONSTRAINT unique_weight;
