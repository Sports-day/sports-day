package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"sports-day/api"
	"github.com/oklog/ulid/v2"
)

type imageService interface {
	MarkUploaded(ctx context.Context, id string, url string) error
}

type S3Event struct {
	Records []struct {
		S3 struct {
			Object struct {
				Key string `json:"key"`
			} `json:"object"`
		} `json:"s3"`
	} `json:"Records"`
}

func HandleUploadWebhook(
	imageSvc imageService,
	secret string,
	cdnBase string,
	bucket string,
) http.HandlerFunc {

	return func(w http.ResponseWriter, r *http.Request) {

		if r.Header.Get("X-Webhook-Secret") != secret {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		var event S3Event
		if err := json.NewDecoder(r.Body).Decode(&event); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		for _, record := range event.Records {
			objectKey := record.S3.Object.Key
			publicURL := fmt.Sprintf("%s/%s/%s", cdnBase, bucket, objectKey)

			// objectKey = "{imageID}/{filename}" の先頭セグメントがImageID
			imageID := strings.SplitN(objectKey, "/", 2)[0]
			if _, err := ulid.Parse(imageID); err != nil {
				api.Logger.Error().
					Err(err).
					Str("objectKey", objectKey).
					Msg("invalid imageID in object key")
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			if err := imageSvc.MarkUploaded(r.Context(), imageID, publicURL); err != nil {
				api.Logger.Error().
					Err(err).
					Str("imageID", imageID).
					Msg("failed to mark image as uploaded")
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
