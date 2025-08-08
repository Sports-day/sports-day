# CLAUDE.md

**ALWAYS RESPOND IN 日本語(Japanese)**
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sports-day is a multi-application sports management system built with Go backend and Next.js frontend applications. The project manages sports events, teams, users, locations, and information for sports day activities.

## Architecture

The project follows a monorepo structure with:

- **Backend API** (`/api`): Go-based GraphQL API using gqlgen
- **Admin Panel** (`/apps/admin`): Next.js admin interface for system management
- **User Panel** (`/apps/panel`): Next.js user-facing interface for participants
- **Form App** (`/apps/form`): Next.js form application
- **Mock Services** (`/mock`): TypeScript mock/testing utilities

### Backend Architecture

- **GraphQL API**: Using gqlgen for code generation
- **Database**: MySQL with GORM ORM and XO for model generation
- **Authentication**: OIDC with JWT tokens
- **Database Migrations**: dbmate for schema management
- **Code Structure**:
  - `api/graph/`: GraphQL schema and resolvers
  - `api/db_model/`: Auto-generated database models (XO)
  - `api/repository/`: Database access layer
  - `api/service/`: Business logic layer
  - `api/middleware/`: HTTP middleware (auth, CORS, etc.)
  - `api/loader/`: DataLoader implementations for N+1 query prevention

### Frontend Architecture

- **Framework**: Next.js with App Router
- **UI Libraries**: Material-UI (MUI), Emotion for styling
- **State Management**: Local state with React hooks
- **Data Fetching**: Custom API clients for GraphQL communication

## Development Commands

### Backend Development

```bash
# Start the API server
make backend/run

# Database migrations
make migrate-up          # Run pending migrations
make migrate-down        # Rollback last migration
make migrate-status      # Check migration status
make migrate-reset       # Reset database and run seeds

# Code generation
make gen                 # Generate all code (DB models + GraphQL)
make gen-dbmodel         # Generate database models from schema
make gen-api             # Generate GraphQL code
make backend/format      # Format Go code with goimports

# Database utilities
make migrate-new         # Create new migration (prompts for comment)
make migrate-seed        # Run database seeds
```

### Frontend Development

```bash
# Admin panel
cd apps/admin
yarn dev                 # Start dev server
yarn build              # Production build
yarn lint               # Run ESLint

# User panel
cd apps/panel
yarn dev                 # Start dev server
yarn build              # Production build
yarn lint               # Run ESLint

# Form app
cd apps/form
yarn dev                 # Start dev server
```

## Key Development Practices

### Database Development

- Database schema is managed in `api/db_schema/schema.sql`
- Migrations are in `api/db_schema/migrations/`
- Database models are auto-generated using XO tool - never edit `*.xo.go` files directly
- Seeds are in `api/db_schema/seed/`
- Always run `make gen-dbmodel` after schema changes

### GraphQL Development

- Schema definitions are in `api/graph/*.graphqls`
- Resolvers are auto-generated but implementations go in `api/graph/*.resolvers.go`
- Always run `make gen-api` after schema changes
- Use DataLoaders (in `api/loader/`) to prevent N+1 queries

### Code Generation Workflow

1. Make database schema changes in `api/db_schema/schema.sql`
2. Create migration with `make migrate-new`
3. Run `make migrate-up` to apply migration
4. Run `make gen` to regenerate models and API code
5. Implement any new resolvers or business logic

### Environment Setup

- Copy `.env.example` to `.env` and configure database connection
- The Makefile requires `.env` file to exist for database operations
- Database connection format: `mysql://user:password@host/database`

## Git Workflow

- Main branch: `main` (production)
- Create feature branches from `main`
- Commit format: `<type>: <subject>` where type is feat/change/fix/docs/style/refactor/debug

## Project Dependencies

### Backend (Go)

- gqlgen: GraphQL code generation
- GORM: Database ORM
- XO: Database model generation
- dbmate: Database migrations
- OIDC/JWT: Authentication
- zerolog: Logging

### Frontend (Node.js/TypeScript)

- Next.js: React framework
- Material-UI: UI component library
- Emotion: CSS-in-JS styling
- ag-grid: Data grid components
- React Flow: Diagram/flow components
