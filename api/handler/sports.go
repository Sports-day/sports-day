func (h *Handler) SetSportImage(c echo.Context) error {
	id := c.Param("id")

	var body struct {
		ImageID string `json:"image_id"`
	}

	if err := c.Bind(&body); err != nil {
		return err
	}

	ctx := c.Request().Context()

	err := h.sportService.SetImage(
		ctx,
		id,
		body.ImageID,
	)

	if err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}