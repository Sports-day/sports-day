package model

import (
	"sports-day/api/db_model"
)

func FormatUserResponse(user *db_model.User) *User {
	return &User{
		ID:    user.ID,
		Name:  user.Name,
		Email: user.Email,
	}
}

func FormatGroupResponse(group *db_model.Group) *Group {
	return &Group{
		ID:   group.ID,
		Name: group.Name,
	}
}

func FormatTeamResponse(team *db_model.Team) *Team {
	return &Team{
		ID:      team.ID,
		Name:    team.Name,
		GroupID: team.GroupID,
	}
}
