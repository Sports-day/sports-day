package storage

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

func NewClient(endpoint, accessKey, secretKey string, useSSL bool) *s3.Client {

	scheme := "http"
	if useSSL {
		scheme = "https"
	}

	cfg := aws.Config{
		Region: "auto",
		Credentials: credentials.NewStaticCredentialsProvider(
			accessKey,
			secretKey,
			"",
		),
		EndpointResolverWithOptions: aws.EndpointResolverWithOptionsFunc(
			func(service, region string, options ...interface{}) (aws.Endpoint, error) {
				return aws.Endpoint{
					URL: fmt.Sprintf("%s://%s", scheme, endpoint),
				}, nil
			},
		),
	}

	return s3.NewFromConfig(cfg)
}

func PresignPut(
	client *s3.Client,
	bucket string,
	key string,
) (string, error) {

	presigner := s3.NewPresignClient(client)

	req, err := presigner.PresignPutObject(
		context.TODO(),
		&s3.PutObjectInput{
			Bucket: &bucket,
			Key:    &key,
		},
	)

	if err != nil {
		return "", err
	}

	return req.URL, nil
}