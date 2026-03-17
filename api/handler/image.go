package handler

import (
	"net/http"
	"sports-day/api/db_model"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/labstack/echo/v4"
	"github.com/oklog/ulid/v2"
)

type PresignRequest struct {
	OwnerType string  `json:"owner_type"`
	OwnerID   *string `json:"owner_id"`
	Filename  string  `json:"filename"`
}

func (h *Handler) IssuePresignedURL(c echo.Context) error {
	var req PresignRequest

	if err := c.Bind(&req); err != nil {
		return err
	}

	ctx := c.Request().Context()

	imageID := ulid.Make()
	objectKey := imageID.String()

	_, err := h.repo.Create(
		ctx,
		nil,
		&db_model.Image{
			ID:     imageID.String(),
        	Status: "pending",
		},
	)

	presignClient := s3.NewPresignClient(h.s3)

	reqPresign, err := presignClient.PresignPutObject(ctx, &s3.PutObjectInput{
		Bucket: &h.bucket,
		Key:    &objectKey,
		ContentType: &[]string{
			"application/octet-stream",
		}[0],
	}, s3.WithPresignExpires(15*time.Minute))

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"upload_url": reqPresign.URL,
		"image_id":   imageID.String(),
	})
}