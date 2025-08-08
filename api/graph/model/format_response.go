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
	return &Match{
		ID:            match.ID,
		Time:          match.Time.Format(time.RFC3339),
		Status:        MatchStatus(match.Status),
		LocationId:    match.LocationID,
		CompetitionId: match.CompetitionID,
		WinnerTeamId:  match.WinnerTeamID.String,
	}
}

func FormatMatchEntryResponse(entry *db_model.MatchEntry) *MatchEntry {
	return &MatchEntry{
		ID:    entry.ID,
		Score: int32(entry.Score),
	}
}

func FormatJudgmentResponse(judgment *db_model.Judgment) *Judgment {
	return &Judgment{
		ID:      judgment.ID,
		Name:    judgment.Name.String,
		UserId:  judgment.UserID.String,
		TeamId:  judgment.TeamID.String,
		GroupId: judgment.GroupID.String,
	}
}
