package authz

// Authorizer は認可判定を行うインターフェース。
type Authorizer interface {
	// HasPermission は指定ロールが指定パーミッションを持つかを返す。
	HasPermission(role string, permission string) bool
	// PermissionsFor は指定ロールが持つパーミッション一覧を返す。
	PermissionsFor(role string) []string
}

// 定義済みロール
const (
	RoleAdmin       = "admin"
	RoleOrganizer   = "organizer"
	RoleParticipant = "participant"
)

// 定義済みパーミッション
const (
	PermTournamentRead  = "tournament:read"
	PermTournamentWrite = "tournament:write"
	PermTeamRead        = "team:read"
	PermTeamWrite       = "team:write"
	PermMatchRead       = "match:read"
	PermMatchWrite      = "match:write"
	PermUserRead        = "user:read"
	PermUserManage      = "user:manage"
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
				PermTournamentRead:  true,
				PermTournamentWrite: true,
				PermTeamRead:        true,
				PermTeamWrite:       true,
				PermMatchRead:       true,
				PermMatchWrite:      true,
				PermUserRead:        true,
				PermUserManage:      true,
			},
			RoleOrganizer: {
				PermTournamentRead:  true,
				PermTournamentWrite: true,
				PermTeamRead:        true,
				PermTeamWrite:       true,
				PermMatchRead:       true,
				PermMatchWrite:      true,
				PermUserRead:        true,
				PermUserManage:      false,
			},
			RoleParticipant: {
				PermTournamentRead:  true,
				PermTeamRead:        true,
				PermMatchRead:       true,
				PermTournamentWrite: false,
				PermTeamWrite:       false,
				PermMatchWrite:      false,
				PermUserRead:        false,
				PermUserManage:      false,
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

// PermissionsFor は指定ロールが持つパーミッション一覧を返す。
// 未知のロールの場合は空スライスを返す。
func (a *StaticAuthorizer) PermissionsFor(role string) []string {
	rolePerms, ok := a.permissions[role]
	if !ok {
		return []string{}
	}
	result := make([]string, 0, len(rolePerms))
	for perm, allowed := range rolePerms {
		if allowed {
			result = append(result, perm)
		}
	}
	return result
}
