package errors

var (
	ErrorServerPanic = NewError("INTERNAL_SERVER_ERROR", "予期しないエラーが発生しました")

	/*
		NotFound
	*/
	ErrUserNotFound        = NewError("USER_NOT_FOUND", "ユーザーが見つかりません")
	ErrGroupNotFound       = NewError("GROUP_NOT_FOUND", "グループが見つかりません")
	ErrTeamNotFound        = NewError("TEAM_NOT_FOUND", "チームが見つかりません")
	ErrLocationNotFound    = NewError("LOCATION_NOT_FOUND", "場所が見つかりません")
	ErrSportNotFound       = NewError("SPORT_NOT_FOUND", "スポーツが見つかりません")
	ErrSceneNotFound       = NewError("SCENE_NOT_FOUND", "シーンが見つかりません")
	ErrInformationNotFound = NewError("INFORMATION_NOT_FOUND", "お知らせが見つかりません")
	ErrCompetitionNotFound = NewError("COMPETITION_NOT_FOUND", "大会が見つかりません")
	ErrMatchNotFound       = NewError("MATCH_NOT_FOUND", "試合が見つかりません")
	ErrJudgmentNotFound    = NewError("JUDGMENT_NOT_FOUND", "審判が見つかりません")
	ErrLeagueNotFound      = NewError("LEAGUE_NOT_FOUND", "リーグが見つかりません")

	/*
		Validation
	*/
	ErrSaveTeam               = NewError("TEAM_SAVE_FAILED", "チームの更新に失敗しました")
	ErrAddTeamUser            = NewError("TEAM_USER_ADD_FAILED", "チームユーザーの追加に失敗しました")
	ErrDeleteTeamUser         = NewError("TEAM_USER_REMOVE_FAILED", "チームユーザーの削除に失敗しました")
	ErrSaveLocation           = NewError("LOCATION_SAVE_FAILED", "場所の更新に失敗しました")
	ErrSaveSport              = NewError("SPORT_SAVE_FAILED", "スポーツの更新に失敗しました")
	ErrSaveScene              = NewError("SCENE_SAVE_FAILED", "シーンの更新に失敗しました")
	ErrSaveInformation        = NewError("INFORMATION_SAVE_FAILED", "お知らせの更新に失敗しました")
	ErrSaveCompetition        = NewError("COMPETITION_SAVE_FAILED", "大会の更新に失敗しました")
	ErrAddCompetitionEntry    = NewError("COMPETITION_ENTRY_ADD_FAILED", "大会エントリーの追加に失敗しました")
	ErrDeleteCompetitionEntry = NewError("COMPETITION_ENTRY_REMOVE_FAILED", "大会エントリーの削除に失敗しました")
	ErrSaveMatch              = NewError("MATCH_SAVE_FAILED", "試合の更新に失敗しました")
	ErrAddMatchEntry          = NewError("MATCH_ENTRY_ADD_FAILED", "試合エントリーの追加に失敗しました")
	ErrDeleteMatchEntry       = NewError("MATCH_ENTRY_REMOVE_FAILED", "試合エントリーの削除に失敗しました")
	ErrUpdateMatchEntryScore  = NewError("MATCH_ENTRY_SCORE_UPDATE_FAILED", "試合スコアの更新に失敗しました")
	ErrSaveJudgment           = NewError("JUDGMENT_SAVE_FAILED", "審判の更新に失敗しました")
	ErrJudgmentEntryInvalid   = NewError("JUDGMENT_ENTRY_INVALID", "審判のエントリーは、ユーザー、チーム、グループのいずれか1つのみ指定してください")
	ErrUpsertLeague           = NewError("LEAGUE_UPSERT_FAILED", "リーグ情報の更新に失敗しました")
	ErrMakeLeagueMatches      = NewError("LEAGUE_MATCH_MAKE_FAILED", "リーグの試合生成に失敗しました")
	ErrSaveLeague             = NewError("LEAGUE_SAVE_FAILED", "リーグの保存に失敗しました")
	ErrRankingRuleInvalid     = NewError("RANKING_RULE_INVALID", "ランキングルールが不正です")
	ErrSaveRankingRule        = NewError("RANKING_RULE_SAVE_FAILED", "ランキングルールの保存に失敗しました")
	ErrSaveTiebreakPriority   = NewError("TIEBREAK_PRIORITY_SAVE_FAILED", "タイブレーク優先度の保存に失敗しました")

	ErrPromotionRuleNotFound   = NewError("PROMOTION_RULE_NOT_FOUND", "進出ルールが見つかりません")
	ErrSavePromotionRule       = NewError("PROMOTION_RULE_SAVE_FAILED", "進出ルールの保存に失敗しました")
	ErrDeletePromotionRule     = NewError("PROMOTION_RULE_DELETE_FAILED", "進出ルールの削除に失敗しました")
	ErrPromotionRuleLocked     = NewError("PROMOTION_RULE_LOCKED", "進出先にスコアが入力済みのため進出ルールを変更できません")
	ErrPromotionRuleInvalid    = NewError("PROMOTION_RULE_INVALID", "進出ルールが不正です")
	ErrScoreModificationLocked = NewError("SCORE_MODIFICATION_LOCKED", "進出先の試合が稼働中のためスコアを修正できません")

	ErrTournamentNotFound     = NewError("TOURNAMENT_NOT_FOUND", "トーナメントが見つかりません")
	ErrTournamentSlotNotFound = NewError("TOURNAMENT_SLOT_NOT_FOUND", "トーナメントスロットが見つかりません")
	ErrSaveTournament         = NewError("TOURNAMENT_SAVE_FAILED", "トーナメントの保存に失敗しました")
	ErrSaveTournamentSlot     = NewError("TOURNAMENT_SLOT_SAVE_FAILED", "トーナメントスロットの保存に失敗しました")
	ErrOptimisticLockFailed   = NewError("OPTIMISTIC_LOCK_FAILED", "楽観的ロックに失敗しました（既に更新済み）")

	// トーナメント自動進行・スコア修正関連
	ErrTournamentDrawForbidden           = NewError("TOURNAMENT_DRAW_FORBIDDEN", "トーナメントの試合では引き分けは許可されていません")
	ErrTournamentWinnerRequired          = NewError("TOURNAMENT_WINNER_REQUIRED", "トーナメントの試合を完了するにはwinner_team_idが必要です")
	ErrTournamentScoreModificationLocked = NewError("TOURNAMENT_SCORE_MODIFICATION_LOCKED", "後続の試合が進行中のためスコアを修正できません")
	ErrInvalidSlotCount                  = NewError("INVALID_SLOT_COUNT", "試合に紐づくスロット数が不正です（2である必要があります）")
	ErrMultipleFinalMatches              = NewError("MULTIPLE_FINAL_MATCHES", "ブラケット内に最終試合が正確に1つ存在しません")
	ErrUnreachableSlotSource             = NewError("UNREACHABLE_SLOT_SOURCE", "ブラケット生成中に不正な状態が検出されました")
	/*
		Authentication
	*/
	ErrUnauthorized = NewError("UNAUTHORIZED", "ログインしてください")
	ErrForbidden    = NewError("FORBIDDEN", "アクセスできません")
	ErrTokenExpired = NewError("TOKEN_EXPIRED", "再度ログインしてください")
	ErrLoginFailed  = NewError("LOGIN_FAILED", "ログインできません")
	ErrAuth         = NewError("AUTH_ERROR", "認証エラーが発生しました")
)
