package auth

import (
	"context"
	"fmt"

	"github.com/coreos/go-oidc/v3/oidc"
)

func NewVerifier(ctx context.Context, issuerURL string, clientID string) (*oidc.IDTokenVerifier, error) {
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		return nil, fmt.Errorf("failed to create provider: %w", err)
	}

	return provider.Verifier(&oidc.Config{
		ClientID: clientID,
	}), nil
}
