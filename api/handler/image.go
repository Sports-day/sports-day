package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *Handler) IssuePresignedURL(c echo.Context) error {
	ctx := c.Request().Context()

	img, url, err := h.ImageService.CreateUploadURL(ctx)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, map[string]string{
		"upload_url": url,
		"image_id":   img.ID,
	})
}