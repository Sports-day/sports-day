package gorm

import "database/sql"

// ToNullString converts a string pointer to sql.NullString
func ToNullString(ptr *string) sql.NullString {
	if ptr == nil {
		return sql.NullString{Valid: false}
	}
	return sql.NullString{String: *ptr, Valid: true}
}
