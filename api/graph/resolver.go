package graph

import "sports-day/api/service"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserService  service.User
	AuthService  service.AuthService
	GroupService service.Group
	SceneService service.Scene
}

func NewResolver(
	userService service.User,
	authService service.AuthService,
	groupService service.Group,
	sceneService service.Scene,
) *Resolver {
	return &Resolver{
		UserService:  userService,
		AuthService:  authService,
		GroupService: groupService,
		SceneService: sceneService,
	}
}
