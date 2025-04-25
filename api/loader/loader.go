package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"

	"github.com/vikstrous/dataloadgen"
)

type Loaders struct {
	UserLoader       *dataloadgen.Loader[string, *db_model.User]
	GroupLoader      *dataloadgen.Loader[string, *db_model.Group]
	GroupUsersLoader *dataloadgen.Loader[string, []*db_model.GroupUser]
	UserGroupsLoader *dataloadgen.Loader[string, []*db_model.GroupUser]
}

func New(userSvc service.User, groupSvc service.Group) *Loaders {
	return &Loaders{
		UserLoader:       dataloadgen.NewLoader(newUserLoader(userSvc)),
		GroupLoader:      dataloadgen.NewLoader(newGroupLoader(groupSvc)),
		GroupUsersLoader: dataloadgen.NewLoader(newGroupUsersLoader(groupSvc)),
		UserGroupsLoader: dataloadgen.NewLoader(newUserGroupsLoader(groupSvc)),
	}
}

type loadersKey struct{}

func (l *Loaders) Attach(ctx context.Context) context.Context {
	ctx = context.WithValue(ctx, loadersKey{}, l)
	return ctx
}

func getLoaders(ctx context.Context) *Loaders {
	return ctx.Value(loadersKey{}).(*Loaders)
}
