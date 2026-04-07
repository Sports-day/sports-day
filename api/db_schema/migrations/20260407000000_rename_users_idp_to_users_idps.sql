-- migrate:up
RENAME TABLE `users_idp` TO `users_idps`;

-- migrate:down
RENAME TABLE `users_idps` TO `users_idp`;
