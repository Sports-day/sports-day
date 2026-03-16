package handler

import "sports-day/api/repository"

type Handler struct {
	imageRepo repository.Image
	secret    string
	bucket    string
	cdnBase   string
}