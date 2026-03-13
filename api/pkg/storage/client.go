package storage

import (
	"context"
	"time"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type Client struct {
	client *minio.Client
	bucket string
}

func New(
	endpoint string,
	accessKey string,
	secretKey string,
	bucket string,
	useSSL bool,
) (*Client, error) {

	minioClient, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: useSSL,
	})

	if err != nil {
		return nil, err
	}

	return &Client{
		client: minioClient,
		bucket: bucket,
	}, nil
}

func (c *Client) PresignPutObject(objectKey string) (string, error) {

	url, err := c.client.PresignedPutObject(
		context.Background(),
		c.bucket,
		objectKey,
		time.Minute*10,
	)

	if err != nil {
		return "", err
	}

	return url.String(), nil
}

func (c *Client) DeleteObject(objectKey string) error {

	return c.client.RemoveObject(
		context.Background(),
		c.bucket,
		objectKey,
		minio.RemoveObjectOptions{},
	)
}