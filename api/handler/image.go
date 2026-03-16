package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
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

	img, uploadURL, err := h.imageService.CreateUploadURL(
		ctx,
		req.OwnerType,
		req.OwnerID,
		req.Filename,
	)

	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, map[string]string{
		"upload_url": uploadURL,
		"image_id":   img.ID.String(),
	})
}