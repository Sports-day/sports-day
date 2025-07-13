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
	CompetitionService service.Competition
	MatchService       service.Match
}

func NewResolver(
	userService service.User,
	authService service.AuthService,
	groupService service.Group,
	teamService service.Team,
	locationService service.Location,
	competitionService service.Competition,
	matchService service.Match,
) *Resolver {
	return &Resolver{
		UserService:        userService,
		AuthService:        authService,
		GroupService:       groupService,
		TeamService:        teamService,
		LocationService:    locationService,
		CompetitionService: competitionService,
		MatchService:       matchService,
	}
}
