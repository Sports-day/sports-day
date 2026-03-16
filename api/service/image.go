package service

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/pkg/storage"
	"sports-day/api/pkg/ulid"
	"sports-day/api/repository"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"gorm.io/gorm"
)

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
	ownerType string,
	ownerID *string,
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

	uploadURL, err := storage.PresignPut(
		s.s3,
		s.bucket,
		img.ID,
	)

	if err != nil {
		return nil, "", errors.Wrap(err)
	}

	return img, uploadURL, nil
}
func (s *Image) MarkUploaded(
	ctx context.Context,
	id string,
	url string,
) (*db_model.Image, error) {

	return s.imageRepository.MarkUploaded(ctx, s.db, id, url)
}
