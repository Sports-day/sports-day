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

func FormatImageResponse(image *db_model.Image) *Image {
	var url *string
	if image.URL.Valid {
		url = &image.URL.String
	}
	return &Image{
		ID:     image.ID,
		URL:    url,
		Status: image.Status,
	}
}

func FormatSportResponse(sport *db_model.Sport) *Sport {
	var imageID *string
	if sport.ImageID.Valid {
		imageID = &sport.ImageID.String
	}
	return &Sport{
		ID:           sport.ID,
		Name:         sport.Name,
		Weight:       int32(sport.Weight),
		RankingRules: []*RankingRule{},
		Rules:        []*Rule{},
		ImageID:      imageID,
	}
}

func FormatSportWithRankingRulesResponse(sport *db_model.Sport, rankingRules []*db_model.RankingRule, rules []*db_model.Rule) *Sport {
	res := FormatSportResponse(sport)
	res.RankingRules = make([]*RankingRule, len(rankingRules))
	for i, r := range rankingRules {
		res.RankingRules[i] = FormatRankingRuleResponse(r)
	}
	res.Rules = make([]*Rule, len(rules))
	for i, r := range rules {
		res.Rules[i] = FormatRuleResponse(r)
	}
	return res
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
		ID:   league.ID,
		Name: competition.Name,
	}
}

func FormatTournamentResponse(tournament *db_model.Tournament, state BracketState, progress float64) *Tournament {
	var pm *PlacementMethod
	if tournament.PlacementMethod.Valid {
		p := PlacementMethod(tournament.PlacementMethod.String)
		pm = &p
	}
	return &Tournament{
		ID:              tournament.ID,
		CompetitionID:   tournament.CompetitionID,
		Name:            tournament.Name,
		BracketType:     BracketType(tournament.BracketType),
		PlacementMethod: pm,
		DisplayOrder:    int32(tournament.DisplayOrder),
		State:           state,
		Progress:        progress,
	}
}

func FormatTournamentSlotResponse(slot *db_model.TournamentSlot) *TournamentSlot {
	var seedNumber *int32
	if slot.SeedNumber.Valid {
		s := int32(slot.SeedNumber.Int64)
		seedNumber = &s
	}
	var sourceMatchID string
	if slot.SourceMatchID.Valid {
		sourceMatchID = slot.SourceMatchID.String
	}
	return &TournamentSlot{
		ID:            slot.ID,
		TournamentID:  slot.TournamentID,
		MatchEntryID:  slot.MatchEntryID,
		SourceType:    SlotSourceType(slot.SourceType),
		SourceMatchID: sourceMatchID,
		SeedNumber:    seedNumber,
	}
}

func FormatPromotionRuleResponse(rule *db_model.PromotionRule, sourceComp *db_model.Competition, targetComp *db_model.Competition) *PromotionRule {
	var slot *int32
	if rule.Slot.Valid {
		s := int32(rule.Slot.Int64)
		slot = &s
	}
	return &PromotionRule{
		ID:                rule.ID,
		SourceCompetition: FormatCompetitionResponse(sourceComp),
		TargetCompetition: FormatCompetitionResponse(targetComp),
		RankSpec:          rule.RankSpec,
		Slot:              slot,
	}
}

func FormatRankingRuleResponse(rule *db_model.RankingRule) *RankingRule {
	return &RankingRule{
		ConditionKey: RankingConditionKey(rule.ConditionKey),
		Priority:     int32(rule.Priority),
	}
}

func FormatRuleResponse(rule *db_model.Rule) *Rule {
	var sportID string
	if rule.SportID.Valid {
		sportID = rule.SportID.String
	}
	return &Rule{
		ID:      rule.ID,
		Rule:    rule.Rule,
		SportID: sportID,
	}
}
