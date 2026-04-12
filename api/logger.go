package api

import (
	"os"

	"github.com/rs/zerolog"
)

var Logger = func() *zerolog.Logger {
	l := zerolog.Nop()
	return &l
}()

func SetLogger(logger *zerolog.Logger) {
	Logger = logger
}

func NewLogger(debug bool) {
	level := zerolog.InfoLevel
	if debug {
		level = zerolog.DebugLevel
	}
	zerolog.SetGlobalLevel(level)
	output := zerolog.ConsoleWriter{
		Out: os.Stdout,
	}

	logger := zerolog.New(output).
		With().
		Timestamp().
		Caller().
		Stack().
		Logger()

	SetLogger(&logger)
}
