package handler

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func (h *Handler) SetSportImage(c echo.Context) error {
	return c.NoContent(http.StatusNotImplemented)
}