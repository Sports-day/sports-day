package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/rs/zerolog"
	"gorm.io/gorm"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"
)

const presignExpiry = 15 * time.Minute

type Image struct {
	db              *gorm.DB
	imageRepository repository.Image
	s3              *s3.Client
	s3Public        *s3.Client
	bucket          string
	endpoint        string
}

func NewImage(
	db *gorm.DB,
	imageRepository repository.Image,
	s3Client *s3.Client,
	s3PublicClient *s3.Client,
	bucket string,
	endpoint string,
) Image {

	return Image{
		db:              db,
		imageRepository: imageRepository,
		s3:              s3Client,
		s3Public:        s3PublicClient,
		bucket:          bucket,
		endpoint:        endpoint,
	}
}

func (s *Image) Get(ctx context.Context, id string) (*db_model.Image, error) {
	return s.imageRepository.Get(ctx, s.db, id)
}

func (s *Image) MarkUploaded(ctx context.Context, id string, url string) error {
	if err := s.imageRepository.MarkUploaded(ctx, s.db, id, url); err != nil {
		return err
	}

	zerolog.Ctx(ctx).Info().
		Str("event", "image_uploaded").
		Str("image_id", id).
		Str("url", url).
		Msg("image marked as uploaded")

	return nil
}

func (s *Image) Delete(ctx context.Context, id string) (*db_model.Image, error) {
	img, err := s.imageRepository.Get(ctx, s.db, id)
	if err != nil {
		return nil, errors.Wrap(err)
	}

	// DB削除を先に行う。S3削除が失敗してもゴミファイルが残るだけで済む。
	// 逆順（S3→DB）だとS3成功後にDB削除失敗で参照不整合が起きる。
	if err := s.imageRepository.Delete(ctx, s.db, id); err != nil {
		return nil, errors.Wrap(err)
	}

	if img.URL.Valid {
		bucketPrefix := "/" + s.bucket + "/"
		if idx := strings.Index(img.URL.String, bucketPrefix); idx >= 0 {
			key := img.URL.String[idx+len(bucketPrefix):]
			if _, err := s.s3.DeleteObject(ctx, &s3.DeleteObjectInput{
				Bucket: &s.bucket,
				Key:    &key,
			}); err != nil {
				// S3削除失敗はログに残すが、DBレコードは既に削除済みなのでエラーとしない
				zerolog.Ctx(ctx).Warn().
					Err(err).
					Str("event", "s3_delete_failed").
					Str("image_id", id).
					Str("key", key).
					Msg("failed to delete S3 object (DB record already deleted)")
			}
		}
	}

	zerolog.Ctx(ctx).Info().
		Str("event", "image_deleted").
		Str("image_id", id).
		Msg("image deleted")

	return img, nil
}

func (s *Image) List(ctx context.Context) ([]*db_model.Image, error) {
	return s.imageRepository.List(ctx, s.db)
}

func (s *Image) GetMapByIDs(ctx context.Context, ids []string) (map[string]*db_model.Image, error) {
	return s.imageRepository.BatchGet(ctx, s.db, ids)
}

func (s *Image) CreateUploadURL(ctx context.Context, filename string) (*db_model.Image, string, error) {
	img := &db_model.Image{
		ID:     ulid.Make(),
		Status: "pending",
	}

	img, err := s.imageRepository.Create(ctx, s.db, img)
	if err != nil {
		return nil, "", errors.Wrap(err)
	}

	presigner := s3.NewPresignClient(s.s3Public)

	key := fmt.Sprintf("%s/%s", img.ID, filename)

	presigned, err := presigner.PresignPutObject(
		ctx,
		&s3.PutObjectInput{
			Bucket: &s.bucket,
			Key:    &key,
		},
		s3.WithPresignExpires(presignExpiry),
	)
	if err != nil {
		return nil, "", errors.Wrap(err)
	}

	zerolog.Ctx(ctx).Info().
		Str("event", "image_upload_url_created").
		Str("image_id", img.ID).
		Str("filename", filename).
		Msg("presigned upload URL created")

	return img, presigned.URL, nil
}

func (s *Image) UpdateDisplayOrders(ctx context.Context, items []repository.DisplayOrderItem) error {
	return s.imageRepository.UpdateDisplayOrders(ctx, s.db, items)
}
