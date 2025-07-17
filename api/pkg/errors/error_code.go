package errors

var (
	ErrorServerPanic = NewError("INTERNAL_SERVER_ERROR", "予期しないエラーが発生しました")

	/*
		NotFound
	*/
	ErrUserNotFound     = NewError("USER_NOT_FOUND", "ユーザーが見つかりません")
	ErrGroupNotFound    = NewError("GROUP_NOT_FOUND", "グループが見つかりません")
	ErrTeamNotFound     = NewError("TEAM_NOT_FOUND", "チームが見つかりません")
	ErrLocationNotFound = NewError("LOCATION_NOT_FOUND", "場所が見つかりません")
	ErrSportNotFound    = NewError("SPORT_NOT_FOUND", "スポーツが見つかりません")
	ErrSceneNotFound    = NewError("SCENE_NOT_FOUND", "シーンが見つかりません")

	/*
		Validation
	*/
	ErrSaveTeam       = NewError("TEAM_SAVE_FAILED", "チームの更新に失敗しました")
	ErrAddTeamUser    = NewError("TEAM_USER_ADD_FAILED", "チームユーザーの追加に失敗しました")
	ErrDeleteTeamUser = NewError("TEAM_USER_REMOVE_FAILED", "チームユーザーの削除に失敗しました")
	ErrSaveLocation   = NewError("LOCATION_SAVE_FAILED", "場所の更新に失敗しました")
	ErrSaveSport      = NewError("SPORT_SAVE_FAILED", "スポーツの更新に失敗しました")
	ErrSaveScene      = NewError("SCENE_SAVE_FAILED", "シーンの更新に失敗しました")
	/*
		Authentication
	*/
	ErrUnauthorized = NewError("UNAUTHORIZED", "ログインしてください")
	ErrForbidden    = NewError("FORBIDDEN", "アクセスできません")
	ErrTokenExpired = NewError("TOKEN_EXPIRED", "再度ログインしてください")
	ErrLoginFailed  = NewError("LOGIN_FAILED", "ログインできません")
	ErrAuth         = NewError("AUTH_ERROR", "認証エラーが発生しました")
)
