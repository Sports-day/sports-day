package webhook

import (
	"encoding/json"
	"fmt"
	"net/http"

	"sports-day/api"
	"sports-day/api/repository"

	"github.com/oklog/ulid/v2"
	"gorm.io/gorm"
)

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
	repo repository.Image,
	db *gorm.DB,
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
			imgID, err := ulid.Parse(objectKey)
			if err != nil {
				api.Logger.Error().
					Err(err).
					Str("objectKey", objectKey).
					Msg("failed to parse object key as ULID")
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			publicURL := fmt.Sprintf("%s/%s/%s",
				cdnBase,
				bucket,
				objectKey,
			)

			if _, err := repo.MarkUploaded(
				r.Context(),
				db,
				imgID.String(),
				publicURL,
			); err != nil {
				api.Logger.Error().
					Err(err).
					Str("imageID", imgID.String()).
					Msg("failed to mark image as uploaded")
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
