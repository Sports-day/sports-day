package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/service"

	"github.com/vikstrous/dataloadgen"
)

type Loaders struct {
	UserLoader               *dataloadgen.Loader[string, *db_model.User]
	GroupLoader              *dataloadgen.Loader[string, *db_model.Group]
	TeamLoader               *dataloadgen.Loader[string, *db_model.Team]
	CompetitionLoader        *dataloadgen.Loader[string, *db_model.Competition]
	LocationLoader           *dataloadgen.Loader[string, *db_model.Location]
	MatchLoader              *dataloadgen.Loader[string, *db_model.Match]
	JudgmentLoader           *dataloadgen.Loader[string, *db_model.Judgment]
	GroupUsersLoader         *dataloadgen.Loader[string, []*db_model.GroupUser]
	UserGroupsLoader         *dataloadgen.Loader[string, []*db_model.GroupUser]
	TeamUsersLoader          *dataloadgen.Loader[string, []*db_model.TeamUser]
	UserTeamsLoader          *dataloadgen.Loader[string, []*db_model.TeamUser]
	GroupTeamsLoader         *dataloadgen.Loader[string, []*db_model.Team]
	CompetitionEntriesLoader *dataloadgen.Loader[string, []*db_model.CompetitionEntry]
	EntryCompetitionsLoader  *dataloadgen.Loader[string, []*db_model.CompetitionEntry]
	MatchEntriesLoader       *dataloadgen.Loader[string, []*db_model.MatchEntry]
	EntryMatchesLoader       *dataloadgen.Loader[string, []*db_model.MatchEntry]
	CompetitionMatchesLoader *dataloadgen.Loader[string, []*db_model.Match]
	LocationMatchesLoader    *dataloadgen.Loader[string, []*db_model.Match]
	UserJudgmentsLoader      *dataloadgen.Loader[string, []*db_model.Judgment]
	TeamJudgmentsLoader      *dataloadgen.Loader[string, []*db_model.Judgment]
	GroupJudgmentsLoader     *dataloadgen.Loader[string, []*db_model.Judgment]
}

func New(userSvc service.User, groupSvc service.Group, teamSvc service.Team, competitionSvc service.Competition, locationSvc service.Location, matchSvc service.Match, judgmentSvc service.Judgment) *Loaders {
	return &Loaders{
		UserLoader:               dataloadgen.NewLoader(newUserLoader(userSvc)),
		GroupLoader:              dataloadgen.NewLoader(newGroupLoader(groupSvc)),
		TeamLoader:               dataloadgen.NewLoader(newTeamLoader(teamSvc)),
		CompetitionLoader:        dataloadgen.NewLoader(newCompetitionLoader(competitionSvc)),
		LocationLoader:           dataloadgen.NewLoader(newLocationLoader(locationSvc)),
		MatchLoader:              dataloadgen.NewLoader(newMatchLoader(matchSvc)),
		JudgmentLoader:           dataloadgen.NewLoader(newJudgmentLoader(judgmentSvc)),
		GroupUsersLoader:         dataloadgen.NewLoader(newGroupUsersLoader(groupSvc)),
		UserGroupsLoader:         dataloadgen.NewLoader(newUserGroupsLoader(groupSvc)),
		TeamUsersLoader:          dataloadgen.NewLoader(newTeamUsersLoader(teamSvc)),
		UserTeamsLoader:          dataloadgen.NewLoader(newUserTeamsLoader(teamSvc)),
		GroupTeamsLoader:         dataloadgen.NewLoader(newGroupTeamsLoader(teamSvc)),
		CompetitionEntriesLoader: dataloadgen.NewLoader(newCompetitionEntriesLoader(competitionSvc)),
		EntryCompetitionsLoader:  dataloadgen.NewLoader(newEntryCompetitionsLoader(competitionSvc)),
		MatchEntriesLoader:       dataloadgen.NewLoader(newMatchEntriesLoader(matchSvc)),
		EntryMatchesLoader:       dataloadgen.NewLoader(newEntryMatchesLoader(matchSvc)),
		CompetitionMatchesLoader: dataloadgen.NewLoader(newCompetitionMatchesLoader(matchSvc)),
		LocationMatchesLoader:    dataloadgen.NewLoader(newLocationMatchesLoader(matchSvc)),
		UserJudgmentsLoader:      dataloadgen.NewLoader(newUserJudgmentsLoader(judgmentSvc)),
		TeamJudgmentsLoader:      dataloadgen.NewLoader(newTeamJudgmentsLoader(judgmentSvc)),
		GroupJudgmentsLoader:     dataloadgen.NewLoader(newGroupJudgmentsLoader(judgmentSvc)),
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
