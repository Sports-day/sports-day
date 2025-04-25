package auth

import (
	"context"
	"fmt"

	"github.com/coreos/go-oidc/v3/oidc"
	"golang.org/x/oauth2"
)

type OIDCTokenData struct {
	Email string
	Name  string
}

type OIDC struct {
	verifier *oidc.IDTokenVerifier
	configs  map[string]*oauth2.Config
}

func NewOIDC(ctx context.Context, issuerURL string, clientID string, clientSecret string, redirectURLs []string) (OIDC, error) {
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		//	TODO replace error
		return OIDC{}, err
	}

	configs := make(map[string]*oauth2.Config, len(redirectURLs))
	for _, redirectURL := range redirectURLs {
		configs[redirectURL] = &oauth2.Config{
			ClientID:     clientID,
			ClientSecret: clientSecret,
			Endpoint:     provider.Endpoint(),
			RedirectURL:  redirectURL,
			Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
		}
	}

	return OIDC{
		verifier: provider.Verifier(&oidc.Config{
			ClientID: clientID,
		}),
		configs: configs,
	}, nil
}

func (o *OIDC) Authenticate(ctx context.Context, code string, redirectURL string) (*OIDCTokenData, error) {
	config, ok := o.configs[redirectURL]
	if !ok {
		//	TODO replace error
		return nil, fmt.Errorf("redirectURL not found in configs")
	}

	token, err := config.Exchange(ctx, code)
	if err != nil {
		//	TODO replace error
		return nil, err
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		//	TODO replace error
		return nil, fmt.Errorf("id_token not found in token response")
	}

	idToken, err := o.verifier.Verify(ctx, rawIDToken)
	if err != nil {
		//	TODO replace error
		return nil, err
	}

	var claims struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := idToken.Claims(&claims); err != nil {
		//	TODO replace error
		return nil, err
	}

	return &OIDCTokenData{
		Email: claims.Email,
		Name:  claims.Name,
	}, nil
}
