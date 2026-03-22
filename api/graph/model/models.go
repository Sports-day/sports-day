package model

type Group struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type User struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

type Team struct {
	ID      string `json:"id"`
	Name    string `json:"name"`
	GroupID string `json:"groupId"`
}

type Competition struct {
	ID   string          `json:"id"`
	Name string          `json:"name"`
	Type CompetitionType `json:"type"`
}

type Match struct {
	ID            string      `json:"id"`
	Time          string      `json:"time"`
	Status        MatchStatus `json:"status"`
	LocationId    string      `json:"locationId"`
	CompetitionId string      `json:"competitionId"`
	WinnerTeamId  string      `json:"winnerTeamId"`
}

type Location struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type Judgment struct {
	ID      string `json:"matchId"`
	Name    string `json:"name"`
	UserId  string `json:"userId"`
	TeamId  string `json:"teamId"`
	GroupId string `json:"groupId"`
}

type League struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type ComputedStanding struct {
	TeamID       string `json:"teamId"`
	Rank         int32  `json:"rank"`
	Win          int32  `json:"win"`
	Draw         int32  `json:"draw"`
	Lose         int32  `json:"lose"`
	GoalsFor     int32  `json:"goalsFor"`
	GoalsAgainst int32  `json:"goalsAgainst"`
	GoalDiff     int32  `json:"goalDiff"`
	Points       int32  `json:"points"`
	MatchesPlayed int32 `json:"matchesPlayed"`
}
