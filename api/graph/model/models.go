package model

type Group struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type User struct {
	ID    string  `json:"id"`
	Name  *string `json:"name,omitempty"`
	Email *string `json:"email,omitempty"`
}

type Team struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	GroupID string `json:"groupId"`
}

type Competition struct {
	ID                string          `json:"id"`
	Name              string          `json:"name"`
	Type              CompetitionType `json:"type"`
	SportID           string          `json:"sportId"`
	SceneID           string          `json:"sceneId"`
	StartTime         *string         `json:"startTime,omitempty"`
	MatchDuration     *int32          `json:"matchDuration,omitempty"`
	BreakDuration     *int32          `json:"breakDuration,omitempty"`
	DefaultLocationID string          `json:"defaultLocationId"`
	DisplayOrder      int32           `json:"displayOrder"`
}

type Match struct {
	ID             string      `json:"id"`
	Time           string      `json:"time"`
	Status         MatchStatus `json:"status"`
	LocationId     string      `json:"locationId"`
	CompetitionId  string      `json:"competitionId"`
	WinnerTeamId   string      `json:"winnerTeamId"`
	TimeManual     bool        `json:"timeManual"`
	LocationManual bool        `json:"locationManual"`
}

type Location struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	DisplayOrder int32  `json:"displayOrder"`
}

type Judgment struct {
	ID          string `json:"matchId"`
	Name        string `json:"name"`
	UserId      string `json:"userId"`
	TeamId      string `json:"teamId"`
	GroupId     string `json:"groupId"`
	IsAttending bool   `json:"isAttending"`
}

type League struct {
	ID     string `json:"id"`
	Name   string `json:"name"`
	WinPt  int32  `json:"winPt"`
	DrawPt int32  `json:"drawPt"`
	LosePt int32  `json:"losePt"`
}

type Tournament struct {
	ID              string           `json:"id"`
	CompetitionID   string           `json:"competitionId"`
	Name            string           `json:"name"`
	BracketType     BracketType      `json:"bracketType"`
	PlacementMethod *PlacementMethod `json:"placementMethod,omitempty"`
	DisplayOrder    int32            `json:"displayOrder"`
	State           BracketState     `json:"state"`
	Progress        float64          `json:"progress"`
}

type TournamentSlot struct {
	ID            string         `json:"id"`
	TournamentID  string         `json:"tournamentId"`
	MatchEntryID  string         `json:"matchEntryId"`
	SourceType    SlotSourceType `json:"sourceType"`
	SourceMatchID string         `json:"sourceMatchId"`
	SeedNumber    *int32         `json:"seedNumber,omitempty"`
}

type PromotionRuleModel struct {
	ID                  string `json:"id"`
	SourceCompetitionID string `json:"sourceCompetitionId"`
	TargetCompetitionID string `json:"targetCompetitionId"`
	RankSpec            string `json:"rankSpec"`
	Slot                *int32 `json:"slot,omitempty"`
}

type TournamentRanking struct {
	Rank   int32  `json:"rank"`
	TeamID string `json:"teamId"`
	IsTied bool   `json:"isTied"`
}

type Standing struct {
	ID            string `json:"id"`
	TeamID        string `json:"team_id"`
	Points        int32  `json:"points"`
	Rank          int32  `json:"rank"`
	Win           int32  `json:"win"`
	Draw          int32  `json:"draw"`
	Lose          int32  `json:"lose"`
	GoalsFor      int32  `json:"gf"`
	GoalsAgainst  int32  `json:"ga"`
	GoalDiff      int32  `json:"gd"`
	MatchesPlayed int32  `json:"matchesPlayed"`
}

type Rule struct {
	ID      string `json:"id"`
	Rule    string `json:"rule"`
	SportID string `json:"sportId"`
}

type Scene struct {
	ID           string `json:"id"`
	Name         string `json:"name"`
	DisplayOrder int32  `json:"displayOrder"`
	IsDeleted    bool   `json:"isDeleted"`
}

type Sport struct {
	ID               string         `json:"id"`
	Name             string         `json:"name"`
	DisplayOrder     int32          `json:"displayOrder"`
	ExperiencedLimit *int32         `json:"experiencedLimit,omitempty"`
	RankingRules     []*RankingRule `json:"rankingRules"`
	Rules            []*Rule        `json:"rules"`
	ImageID          *string        `json:"imageId"`
}

type SportScene struct {
	ID      string `json:"id"`
	SportID string `json:"sportId"`
	SceneID string `json:"sceneId"`
}

type SportEntry struct {
	ID           string `json:"id"`
	SportSceneID string `json:"sportSceneId"`
	TeamID       string `json:"teamId"`
}
