package errors

import "github.com/pkg/errors"

func Wrap(err error) error {
	return errors.Wrap(err, "")
}

func Is(err error, target error) bool {
	return errors.Is(err, target)
}

func As(err error, target interface{}) bool {
	return errors.As(err, target)
}
