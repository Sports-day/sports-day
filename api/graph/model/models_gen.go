// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AuthResponse struct {
	Token string `json:"token"`
	User  *User  `json:"user"`
}

type CreateGroupInput struct {
	Name string `json:"name"`
}

type CreateUserInput struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type LoginInput struct {
	Code        string `json:"code"`
	RedirectURL string `json:"redirectURL"`
}

type Mutation struct {
}

type Query struct {
}

type UpdateGroupInput struct {
	Name *string `json:"name,omitempty"`
}

type UpdateGroupUsersInput struct {
	UserIds []string `json:"userIds"`
}
