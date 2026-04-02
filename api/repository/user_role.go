package repository

import (
	"context"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"

	"sports-day/api/db_model"
	"sports-day/api/pkg/errors"
)

// UserRole は user_roles テーブルへのアクセスインターフェース。
type UserRole interface {
	// GetBySub は sub に対応する UserRole レコードを取得する。
	// 存在しない場合は errors.ErrUserNotFound を返す。
	GetBySub(ctx context.Context, db *gorm.DB, sub string) (*db_model.UserRole, error)
	// Upsert は UserRole レコードを INSERT または UPDATE する。
	Upsert(ctx context.Context, db *gorm.DB, userRole *db_model.UserRole) (*db_model.UserRole, error)
	// CountAdmins は role = 'admin' のレコード数を返す。
	CountAdmins(ctx context.Context, db *gorm.DB) (int64, error)
}

type userRole struct{}

// NewUserRole は UserRole インターフェースの実装を返す。
func NewUserRole() UserRole { return userRole{} }

// GetBySub は sub に対応する UserRole レコードを取得する。
func (r userRole) GetBySub(ctx context.Context, db *gorm.DB, sub string) (*db_model.UserRole, error) {
	var record db_model.UserRole
	if err := db.First(&record, "sub = ?", sub).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.ErrUserNotFound
		}
		return nil, errors.Wrap(err)
	}
	return &record, nil
}

// Upsert は UserRole レコードを INSERT または UPDATE する。
// sub が既存の場合は role を更新する。
func (r userRole) Upsert(ctx context.Context, db *gorm.DB, userRole *db_model.UserRole) (*db_model.UserRole, error) {
	if err := db.Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "sub"}},
		DoUpdates: clause.AssignmentColumns([]string{"role"}),
	}).Create(userRole).Error; err != nil {
		return nil, errors.Wrap(err)
	}
	return userRole, nil
}

// CountAdmins は role = 'admin' のレコード数を返す。
func (r userRole) CountAdmins(ctx context.Context, db *gorm.DB) (int64, error) {
	var count int64
	if err := db.Model(&db_model.UserRole{}).Where("role = ?", "admin").Count(&count).Error; err != nil {
		return 0, errors.Wrap(err)
	}
	return count, nil
}
