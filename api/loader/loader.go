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
	TeamLoader       *dataloadgen.Loader[string, *db_model.Team]
	GroupUsersLoader *dataloadgen.Loader[string, []*db_model.GroupUser]
	UserGroupsLoader *dataloadgen.Loader[string, []*db_model.GroupUser]
	TeamUsersLoader  *dataloadgen.Loader[string, []*db_model.TeamUser]
	UserTeamsLoader  *dataloadgen.Loader[string, []*db_model.TeamUser]
	GroupTeamsLoader *dataloadgen.Loader[string, []*db_model.Team]
}

func New(userSvc service.User, groupSvc service.Group, teamSvc service.Team) *Loaders {
	return &Loaders{
		UserLoader:       dataloadgen.NewLoader(newUserLoader(userSvc)),
		GroupLoader:      dataloadgen.NewLoader(newGroupLoader(groupSvc)),
		TeamLoader:       dataloadgen.NewLoader(newTeamLoader(teamSvc)),
		GroupUsersLoader: dataloadgen.NewLoader(newGroupUsersLoader(groupSvc)),
		UserGroupsLoader: dataloadgen.NewLoader(newUserGroupsLoader(groupSvc)),
		TeamUsersLoader:  dataloadgen.NewLoader(newTeamUsersLoader(teamSvc)),
		UserTeamsLoader:  dataloadgen.NewLoader(newUserTeamsLoader(teamSvc)),
		GroupTeamsLoader: dataloadgen.NewLoader(newGroupTeamsLoader(teamSvc)),
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
