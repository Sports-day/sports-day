package service

import (
	"context"
	"fmt"
	"time"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"gorm.io/gorm"
)

const presignExpiry = 15 * time.Minute

type Image struct {
	db              *gorm.DB
	imageRepository repository.Image
	s3              *s3.Client
	bucket          string
}

func NewImage(
	db *gorm.DB,
	imageRepository repository.Image,
	s3 *s3.Client,
	bucket string,
) Image {

	return Image{
		db:              db,
		imageRepository: imageRepository,
		s3:              s3,
		bucket:          bucket,
	}
}

func (s *Image) CreateUploadURL(
	ctx context.Context,
	filename string,
) (*db_model.Image, string, error) {

	img := &db_model.Image{
		ID:     ulid.Make(),
		Status: "pending",
	}

	img, err := s.imageRepository.Create(ctx, s.db, img)
	if err != nil {
		return nil, "", errors.Wrap(err)
	}

	presigner := s3.NewPresignClient(s.s3)

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

	return img, presigned.URL, nil
}
