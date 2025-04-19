package errors

var (
	ErrorServerPanic = NewError("INTERNAL_SERVER_ERROR", "予期しないエラーが発生しました")

	/*
		NotFound
	*/
	ErrUserNotFound  = NewError("USER_NOT_FOUND", "ユーザーが見つかりません")
	ErrGroupNotFound = NewError("GROUP_NOT_FOUND", "グループが見つかりません")

	/*
		Authentication
	*/
	ErrUnauthorized = NewError("UNAUTHORIZED", "ログインしてください")
	ErrForbidden    = NewError("FORBIDDEN", "アクセスできません")
	ErrTokenExpired = NewError("TOKEN_EXPIRED", "再度ログインしてください")
	ErrLoginFailed  = NewError("LOGIN_FAILED", "ログインできません")
	ErrAuth         = NewError("AUTH_ERROR", "認証エラーが発生しました")
)
