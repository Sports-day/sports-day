package model

import (
	"time"

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

func FormatInformationResponse(information *db_model.Information) *Information {
	return &Information{
		ID:      information.ID,
		Title:   information.Title,
		Content: information.Content,
	}
}

func FormatSceneResponse(scene *db_model.Scene) *Scene {
	return &Scene{
		ID:   scene.ID,
		Name: scene.Name,
	}
}

func FormatSportResponse(sport *db_model.Sport) *Sport {
	return &Sport{
		ID:     sport.ID,
		Name:   sport.Name,
		Weight: int32(sport.Weight),
	}
}

func FormatTeamResponse(team *db_model.Team) *Team {
	return &Team{
		ID:      team.ID,
		Name:    team.Name,
		GroupID: team.GroupID,
	}
}

func FormatLocationResponse(location *db_model.Location) *Location {
	return &Location{
		ID:   location.ID,
		Name: location.Name,
	}
}

func FormatCompetitionResponse(competition *db_model.Competition) *Competition {
	return &Competition{
		ID:   competition.ID,
		Name: competition.Name,
		Type: CompetitionType(competition.Type),
	}
}

func FormatMatchResponse(match *db_model.Match) *Match {
	var locationId string
	if match.LocationID.Valid {
		locationId = match.LocationID.String
	}

	var winnerTeamId string
	if match.WinnerTeamID.Valid {
		winnerTeamId = match.WinnerTeamID.String
	}

	return &Match{
		ID:            match.ID,
		Time:          match.Time.Format(time.RFC3339),
		Status:        MatchStatus(match.Status),
		LocationId:    locationId,
		CompetitionId: match.CompetitionID,
		WinnerTeamId:  winnerTeamId,
	}
}

func FormatMatchEntryResponse(entry *db_model.MatchEntry) *MatchEntry {
	return &MatchEntry{
		ID:    entry.ID,
		Score: int32(entry.Score),
	}
}

func FormatJudgmentResponse(judgment *db_model.Judgment) *Judgment {
	var name, userId, teamId, groupId string

	if judgment.Name.Valid {
		name = judgment.Name.String
	}
	if judgment.UserID.Valid {
		userId = judgment.UserID.String
	}
	if judgment.TeamID.Valid {
		teamId = judgment.TeamID.String
	}
	if judgment.GroupID.Valid {
		groupId = judgment.GroupID.String
	}

	return &Judgment{
		ID:      judgment.ID,
		Name:    name,
		UserId:  userId,
		TeamId:  teamId,
		GroupId: groupId,
	}
}

func FormatLeagueResponse(league *db_model.League, competition *db_model.Competition) *League {
	return &League{
		ID:              league.ID,
		Name:            competition.Name,
		CalculationType: CalculationType(league.CalculationType),
	}
}

func FormatStandingResponse(standing *db_model.LeagueStanding) *Standing {
	return &Standing{
		ID:           standing.ID,
		TeamID:       standing.TeamID,
		Win:          int32(standing.Win),
		Draw:         int32(standing.Draw),
		Lose:         int32(standing.Lose),
		GoalsFor:     int32(standing.GoalsFor),
		GoalsAgainst: int32(standing.GoalsAgainst),
		GoalDiff:     int32(standing.GoalDiff),
		Points:       int32(standing.Points),
		Rank:         int32(standing.Rank),
	}
}
