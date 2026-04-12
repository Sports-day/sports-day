package loader

import (
	"context"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
	"sports-day/api/service"
)

func newImageLoader(svc service.Image) func(context.Context, []string) ([]*db_model.Image, []error) {
	return func(ctx context.Context, imageIDs []string) ([]*db_model.Image, []error) {
		rowMap, err := svc.GetMapByIDs(ctx, imageIDs)
		if err != nil {
			return nil, []error{err}
		}

		images := make([]*db_model.Image, len(imageIDs))
		errs := make([]error, len(imageIDs))
		for i, id := range imageIDs {
			if img, ok := rowMap[id]; ok {
				images[i] = img
			} else {
				errs[i] = errors.ErrImageNotFound
			}
		}
		return images, errs
	}
}

func LoadImage(ctx context.Context, imageID string) (*db_model.Image, error) {
	img, err := getLoaders(ctx).ImageLoader.Load(ctx, imageID)
	if err != nil {
		if errors.Is(err, errors.ErrImageNotFound) {
			return nil, nil
		}
		return nil, errors.Wrap(err)
	}
	return img, nil
}
