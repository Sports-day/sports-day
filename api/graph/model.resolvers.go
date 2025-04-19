package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.64

import (
	"context"

	"sports-day/api/graph/model"
)

// Users is the resolver for the users field.
func (r *groupResolver) Users(ctx context.Context, obj *model.Group) ([]*model.User, error) {
	users, err := r.GroupService.GetUsers(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	res := make([]*model.User, 0, len(users))
	for _, user := range users {
		res = append(res, model.FormatUserResponse(user))
	}
	return res, nil
}

// Groups is the resolver for the groups field.
func (r *userResolver) Groups(ctx context.Context, obj *model.User) ([]*model.Group, error) {
	groups, err := r.GroupService.GetUserGroups(ctx, obj.ID)
	if err != nil {
		return nil, err
	}

	res := make([]*model.Group, 0, len(groups))
	for _, group := range groups {
		res = append(res, model.FormatGroupResponse(group))
	}
	return res, nil
}

// Group returns GroupResolver implementation.
func (r *Resolver) Group() GroupResolver { return &groupResolver{r} }

// User returns UserResolver implementation.
func (r *Resolver) User() UserResolver { return &userResolver{r} }

type groupResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
