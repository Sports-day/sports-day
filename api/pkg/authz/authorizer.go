package authz

// Authorizer は認可判定を行うインターフェース。
type Authorizer interface {
	// HasPermission は指定ロールが指定パーミッションを持つかを返す。
	HasPermission(role string, permission string) bool
}

// 定義済みロール
const (
	RoleAdmin       = "admin"
	RoleOrganizer   = "organizer"
	RoleParticipant = "participant"
)

// 定義済みパーミッション
const (
	PermCompetitionWrite = "competition:write"
	PermTeamWrite        = "team:write"
	PermMatchWrite       = "match:write"
	PermUserWrite        = "user:write"
	PermUserManage       = "user:manage"
	PermGroupWrite       = "group:write"
	PermSportWrite       = "sport:write"
	PermLocationWrite    = "location:write"
	PermSceneWrite       = "scene:write"
	PermEntryWrite       = "entry:write"
	PermInformationWrite = "information:write"
	PermRuleWrite        = "rule:write"
	PermImageWrite       = "image:write"
)

// StaticAuthorizer は Go の map を使った静的ロール-パーミッションマッピング実装。
// 将来 Casbin / OPA への差し替えは Authorizer interface の別実装で対応できる。
type StaticAuthorizer struct {
	permissions map[string]map[string]bool
}

// NewStaticAuthorizer は StaticAuthorizer を初期化して返す。
func NewStaticAuthorizer() *StaticAuthorizer {
	return &StaticAuthorizer{
		permissions: map[string]map[string]bool{
			RoleAdmin: {
				PermCompetitionWrite: true,
				PermTeamWrite:        true,
				PermMatchWrite:       true,
				PermUserWrite:        true,
				PermUserManage:       true,
				PermGroupWrite:       true,
				PermSportWrite:       true,
				PermLocationWrite:    true,
				PermSceneWrite:       true,
				PermInformationWrite: true,
				PermRuleWrite:        true,
				PermImageWrite:       true,
			},
			RoleOrganizer: {
				PermCompetitionWrite: true,
				PermTeamWrite:        true,
				PermMatchWrite:       true,
				PermUserWrite:        true,
				PermUserManage:       false,
				PermGroupWrite:       true,
				PermSportWrite:       true,
				PermLocationWrite:    true,
				PermSceneWrite:       true,
				PermInformationWrite: true,
				PermRuleWrite:        true,
				PermImageWrite:       true,
			},
			RoleParticipant: {
				PermCompetitionWrite: false,
				PermTeamWrite:        false,
				PermMatchWrite:       false,
				PermUserWrite:        false,
				PermUserManage:       false,
				PermGroupWrite:       false,
				PermSportWrite:       false,
				PermLocationWrite:    false,
				PermSceneWrite:       false,
				PermInformationWrite: false,
				PermRuleWrite:        false,
				PermImageWrite:       false,
			},
		},
	}
}

// HasPermission は指定ロールが指定パーミッションを持つかを返す。
// 未知のロールや未知のパーミッションは false を返す（map のゼロ値を利用）。
func (a *StaticAuthorizer) HasPermission(role string, permission string) bool {
	rolePerms, ok := a.permissions[role]
	if !ok {
		return false
	}
	return rolePerms[permission]
}
