package graph

import "sports-day/api/service"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	UserService        service.User
	AuthService        service.AuthService
	GroupService       service.Group
	TeamService        service.Team
	LocationService    service.Location
	SportService       service.Sport
	SceneService       service.Scene
	InformationService service.Information
}

func NewResolver(
	userService service.User,
	authService service.AuthService,
	groupService service.Group,
	teamService service.Team,
	locationService service.Location,
	sportService service.Sport,
	sceneService service.Scene,
	informationService service.Information,
) *Resolver {
	return &Resolver{
		UserService:        userService,
		AuthService:        authService,
		GroupService:       groupService,
		TeamService:        teamService,
		LocationService:    locationService,
		SportService:       sportService,
		SceneService:       sceneService,
		InformationService: informationService,
	}
}
