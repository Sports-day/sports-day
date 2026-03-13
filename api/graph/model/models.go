package model

import (
	"fmt"
	"io"
)

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
	ID              string          `json:"id"`
	Name            string          `json:"name"`
	CalculationType CalculationType `json:"calculationType"`
}

type Standing struct {
	ID           string `json:"id"`
	TeamID       string `json:"team_id"`
	Points       int32  `json:"points"`
	Rank         int32  `json:"rank"`
	Win          int32  `json:"win"`
	Draw         int32  `json:"draw"`
	Lose         int32  `json:"lose"`
	GoalsFor     int32  `json:"gf"`
	GoalsAgainst int32  `json:"ga"`
	GoalDiff     int32  `json:"gd"`
}

type ImageOwnerType string

const (
	ImageOwnerTypeUser  ImageOwnerType = "USER"
	ImageOwnerTypeSport ImageOwnerType = "SPORT"
)

type CreateImageUploadURLInput struct {
	OwnerType ImageOwnerType `json:"ownerType"`
	OwnerID   string         `json:"ownerId"`
	Filename  string         `json:"filename"`
}

type ImageUploadURL struct {
	URL       string `json:"url"`
	ObjectKey string `json:"objectKey"`
}

func (e ImageOwnerType) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, `"`+string(e)+`"`)
}

func (e *ImageOwnerType) UnmarshalGQL(v interface{}) error {
	s, ok := v.(string)
	if !ok {
		return fmt.Errorf("ImageOwnerType must be a string")
	}

	switch s {
	case "USER", "SPORT":
		*e = ImageOwnerType(s)
		return nil
	default:
		return fmt.Errorf("invalid ImageOwnerType: %s", s)
	}
}
