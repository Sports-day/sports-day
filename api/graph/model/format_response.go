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

func FormatSportResponse(sport *db_model.Sport) *Sport {
	return &Sport{
		ID:     sport.ID,
		Name:   sport.Name,
		Weight: int32(sport.Weight),
	}
}
