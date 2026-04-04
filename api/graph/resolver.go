package graph

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/graph/model"
	"sports-day/api/service"
)

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
	CompetitionService service.Competition
	MatchService       service.Match
	JudgmentService    service.Judgment
	LeagueService      service.League
	TournamentService  service.Tournament
	RuleService        service.Rule
	ImageService       service.Image
}

// computeBracketStateForTournament は Tournament に BracketState を付与してレスポンスを生成する。
func (r *Resolver) computeBracketStateForTournament(ctx context.Context, t *db_model.Tournament) (*model.Tournament, error) {
	state, progress, err := r.TournamentService.ComputeBracketState(ctx, nil, t.ID)
	if err != nil {
		state = model.BracketStateBuilding
		progress = 0
	}
	return model.FormatTournamentResponse(t, state, progress), nil
}

// computeBracketStateForTournaments は複数の Tournament に BracketState を付与してレスポンスを生成する。
func (r *Resolver) computeBracketStateForTournaments(ctx context.Context, tournaments []*db_model.Tournament) ([]*model.Tournament, error) {
	result := make([]*model.Tournament, len(tournaments))
	for i, t := range tournaments {
		formatted, err := r.computeBracketStateForTournament(ctx, t)
		if err != nil {
			return nil, err
		}
		result[i] = formatted
	}
	return result, nil
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
	competitionService service.Competition,
	matchService service.Match,
	judgmentService service.Judgment,
	leagueService service.League,
	tournamentService service.Tournament,
	ruleService service.Rule,
	imageService service.Image,
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
		CompetitionService: competitionService,
		MatchService:       matchService,
		JudgmentService:    judgmentService,
		LeagueService:      leagueService,
		TournamentService:  tournamentService,
		RuleService:        ruleService,
		ImageService:       imageService,
	}
}
