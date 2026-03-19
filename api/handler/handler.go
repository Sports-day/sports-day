package handler

import (
	"sports-day/api/repository"
	"sports-day/api/service"

	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type Handler struct {
	repo    repository.Image
	s3      *s3.Client
	secret  string
	bucket  string
	cdnBase string
	ImageService  service.Image
}