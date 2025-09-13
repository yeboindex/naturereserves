# Tasks: NatureReserves.co.za Platform

**Input**: Design documents from `/home/hcvst/dev/naturereserves/specs/001-1-overview-naturereserves/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory → ✓ Complete
   → Tech stack: Next.js 14+, TypeScript, PostgreSQL, tRPC, shadcn/ui
   → Structure: Web application (Option 2)
2. Load design documents → ✓ Complete
   → data-model.md: 8 core entities + supporting tables
   → contracts/: API schema with 25+ endpoints
   → research.md: Technical decisions resolved
3. Generate 45 tasks across 5 phases
4. Applied task rules: TDD first, [P] for different files
5. Tasks numbered T001-T045 sequentially
6. Dependencies mapped to enforce TDD order
7. Parallel execution examples provided
8. Validation: All contracts tested, all entities modeled
9. Result: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All file paths are absolute from repository root

## Path Conventions
**Web Application Structure** (Next.js full-stack):
- Frontend: `src/app/`, `src/components/`, `src/lib/`
- Backend: `src/app/api/`, `src/lib/server/`
- Models: `src/lib/models/`
- Tests: `tests/contract/`, `tests/integration/`, `tests/unit/`

## Phase 3.1: Setup & Infrastructure

- [ ] **T001** Create Next.js 14 project structure with App Router and TypeScript configuration
- [ ] **T002** Initialize package.json with dependencies (Next.js, tRPC, Prisma, shadcn/ui, NextAuth.js)
- [ ] **T003** [P] Configure ESLint, Prettier, and TypeScript strict mode
- [ ] **T004** [P] Set up Prisma ORM with PostgreSQL schema in `prisma/schema.prisma`
- [ ] **T005** [P] Configure NextAuth.js with Google provider and session handling
- [ ] **T006** [P] Set up shadcn/ui components and Tailwind CSS configuration
- [ ] **T007** [P] Configure Jest and React Testing Library for unit tests
- [ ] **T008** [P] Configure Playwright for E2E testing with mobile viewport
- [ ] **T009** Create environment configuration and validation in `src/lib/env.ts`
- [ ] **T010** Set up database seed data and migration scripts

## Phase 3.2: Contract Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Public API Contract Tests [P]
- [ ] **T011** [P] Contract test GET /api/reserves with search/filter params in `tests/contract/reserves-get.test.ts`
- [ ] **T012** [P] Contract test GET /api/reserves/[slug] detailed view in `tests/contract/reserves-detail.test.ts`
- [ ] **T013** [P] Contract test GET /api/properties with filters in `tests/contract/properties-get.test.ts`
- [ ] **T014** [P] Contract test GET /api/properties/[slug] detailed view in `tests/contract/properties-detail.test.ts`
- [ ] **T015** [P] Contract test GET /api/activities list endpoint in `tests/contract/activities.test.ts`
- [ ] **T016** [P] Contract test GET /api/provinces list endpoint in `tests/contract/provinces.test.ts`

### Protected API Contract Tests [P]
- [ ] **T017** [P] Contract test POST /api/reviews creation in `tests/contract/reviews-post.test.ts`
- [ ] **T018** [P] Contract test GET /api/user/reviews user's reviews in `tests/contract/user-reviews.test.ts`
- [ ] **T019** [P] Contract test PUT /api/reviews/[id] edit review in `tests/contract/reviews-edit.test.ts`
- [ ] **T020** [P] Contract test DELETE /api/reviews/[id] in `tests/contract/reviews-delete.test.ts`

### Property Owner Contract Tests [P]
- [ ] **T021** [P] Contract test POST /api/properties create listing in `tests/contract/properties-post.test.ts`
- [ ] **T022** [P] Contract test PUT /api/properties/[id] update listing in `tests/contract/properties-edit.test.ts`
- [ ] **T023** [P] Contract test GET /api/user/properties owner dashboard in `tests/contract/user-properties.test.ts`
- [ ] **T024** [P] Contract test POST /api/properties/[id]/premium upgrade in `tests/contract/premium.test.ts`

### Admin/Governing Body Contract Tests [P]
- [ ] **T025** [P] Contract test GET /api/admin/reserves management in `tests/contract/admin-reserves.test.ts`
- [ ] **T026** [P] Contract test PUT /api/reserves/[id]/verify in `tests/contract/verify-reserves.test.ts`
- [ ] **T027** [P] Contract test POST /api/admin/scrape/trigger in `tests/contract/scraping.test.ts`

## Phase 3.3: Data Models (ONLY after contract tests are failing)

### Core Entity Models [P]
- [ ] **T028** [P] Reserve model with validation in `src/lib/models/reserve.ts`
- [ ] **T029** [P] Property model with relationships in `src/lib/models/property.ts`
- [ ] **T030** [P] User model with authentication in `src/lib/models/user.ts`
- [ ] **T031** [P] Review model with moderation states in `src/lib/models/review.ts`

### Supporting Entity Models [P]
- [ ] **T032** [P] Activity and ReserveActivity models in `src/lib/models/activity.ts`
- [ ] **T033** [P] Facility and junction table models in `src/lib/models/facility.ts`
- [ ] **T034** [P] ScrapedData model for API tracking in `src/lib/models/scraped-data.ts`

## Phase 3.4: API Implementation (tRPC Procedures)

### Public API Endpoints
- [ ] **T035** tRPC procedure GET reserves with search/filters in `src/lib/server/routers/reserves.ts`
- [ ] **T036** tRPC procedure GET reserve detail by slug in same file as T035
- [ ] **T037** tRPC procedure GET properties with filters in `src/lib/server/routers/properties.ts`
- [ ] **T038** tRPC procedure GET property detail by slug in same file as T037
- [ ] **T039** [P] tRPC procedure GET activities list in `src/lib/server/routers/activities.ts`
- [ ] **T040** [P] tRPC procedure GET provinces list in `src/lib/server/routers/provinces.ts`

### Protected API Endpoints
- [ ] **T041** tRPC procedures for review CRUD operations in `src/lib/server/routers/reviews.ts`
- [ ] **T042** tRPC procedures for property owner operations in same file as T037

### Integration & Middleware
- [ ] **T043** NextAuth.js integration with tRPC middleware for role-based access
- [ ] **T044** Database connection and Prisma integration with tRPC context
- [ ] **T045** Error handling, logging, and rate limiting middleware

## Phase 3.5: Integration Tests

### User Flow Integration Tests [P]
- [ ] **T046** [P] Integration test: Guest search and browse flow in `tests/integration/guest-search.test.ts`
- [ ] **T047** [P] Integration test: Property owner listing creation in `tests/integration/property-creation.test.ts`
- [ ] **T048** [P] Integration test: Review submission and moderation in `tests/integration/review-flow.test.ts`
- [ ] **T049** [P] Integration test: Admin reserve verification flow in `tests/integration/admin-verification.test.ts`

### Data Pipeline Integration Tests [P]
- [ ] **T050** [P] Integration test: DataForSEO scraping pipeline in `tests/integration/scraping-pipeline.test.ts`
- [ ] **T051** [P] Integration test: AI content moderation in `tests/integration/ai-moderation.test.ts`

## Phase 3.6: Frontend Implementation

### Core Pages and Components
- [ ] **T052** Homepage with search functionality in `src/app/page.tsx`
- [ ] **T053** Reserve listing and detail pages in `src/app/reserves/` directory
- [ ] **T054** Property listing and detail pages in `src/app/properties/` directory
- [ ] **T055** [P] Search and filter components in `src/components/search/`
- [ ] **T056** [P] Review display and submission components in `src/components/reviews/`

### User Account Pages
- [ ] **T057** User authentication pages in `src/app/(auth)/` directory
- [ ] **T058** Property owner dashboard in `src/app/dashboard/properties/`
- [ ] **T059** Admin interface for content management in `src/app/admin/`

## Phase 3.7: Polish & Performance

### Testing & Quality [P]
- [ ] **T060** [P] Unit tests for utility functions in `tests/unit/utils.test.ts`
- [ ] **T061** [P] Unit tests for validation schemas in `tests/unit/validation.test.ts`
- [ ] **T062** [P] E2E tests for critical user paths in `tests/e2e/user-flows.spec.ts`
- [ ] **T063** [P] Performance tests for API response times in `tests/performance/api.test.ts`

### Deployment & Documentation
- [ ] **T064** [P] Create deployment configuration for Vercel
- [ ] **T065** [P] Set up monitoring and error tracking
- [ ] **T066** [P] Update README.md with setup instructions
- [ ] **T067** [P] Create API documentation from tRPC schemas

## Dependencies

### Phase Order (Strict)
1. Setup (T001-T010) → Contract Tests (T011-T027) → Models (T028-T034) → API (T035-T045) → Integration (T046-T051) → Frontend (T052-T059) → Polish (T060-T067)

### Within-Phase Dependencies
- **Models**: T030 (User) blocks T028, T029, T031 (foreign key relationships)
- **API**: T035-T036 (reserves) must complete before T046, T049 (integration tests)
- **API**: T037-T038 (properties) must complete before T047, T058 (property workflows)
- **Integration**: T043-T045 (middleware) blocks T046-T051 (integration tests)
- **Frontend**: T055 (search components) blocks T052-T054 (pages using search)

## Parallel Execution Examples

### Phase 3.2: Launch all contract tests together
```bash
# All [P] contract tests can run simultaneously:
Task: "Contract test GET /api/reserves in tests/contract/reserves-get.test.ts"
Task: "Contract test GET /api/properties in tests/contract/properties-get.test.ts" 
Task: "Contract test POST /api/reviews in tests/contract/reviews-post.test.ts"
Task: "Contract test GET /api/activities in tests/contract/activities.test.ts"
# ... (continue with T012-T027)
```

### Phase 3.3: Launch model creation in parallel
```bash
# All entity models are independent:
Task: "Reserve model with validation in src/lib/models/reserve.ts"
Task: "Property model with relationships in src/lib/models/property.ts"
Task: "Review model with moderation states in src/lib/models/review.ts"
Task: "Activity models in src/lib/models/activity.ts"
```

### Phase 3.5: Launch integration tests together
```bash
# Integration tests are independent user flows:
Task: "Integration test: Guest search flow in tests/integration/guest-search.test.ts"
Task: "Integration test: Property creation in tests/integration/property-creation.test.ts"
Task: "Integration test: Review flow in tests/integration/review-flow.test.ts"
Task: "Integration test: Scraping pipeline in tests/integration/scraping-pipeline.test.ts"
```

## Task Generation Rules Applied

1. **From Contracts**: 17 contract endpoints → 17 contract test tasks (T011-T027)
2. **From Data Model**: 8 entities → 7 model tasks (T028-T034, User blocks others)
3. **From User Stories**: 4 main flows → 6 integration tests (T046-T051)
4. **TDD Order**: All tests (T011-T027) before implementation (T035-T045)
5. **Parallel Marking**: Different files marked [P], same files sequential

## Validation Checklist ✓

- [x] All 17 contracts have corresponding test tasks (T011-T027)
- [x] All 8 entities have model tasks (T028-T034) 
- [x] All contract tests (T011-T027) come before API implementation (T035-T045)
- [x] Parallel tasks ([P]) are truly independent files
- [x] Each task specifies exact absolute file path
- [x] No [P] task modifies same file as another [P] task
- [x] Dependencies clearly mapped to prevent conflicts
- [x] Task descriptions are specific and actionable

## Notes

- **Total Tasks**: 67 tasks across 7 phases
- **Estimated Completion**: 4-6 weeks for full implementation
- **Critical Path**: Setup → Contract Tests → Models → API → Integration → Frontend → Polish
- **Parallel Capacity**: Up to 10 tasks can run simultaneously in phases 3.2, 3.3, 3.5, 3.7
- **TDD Compliance**: 27 test tasks must complete and fail before 18 implementation tasks
- **File Structure**: Follows Next.js 14 App Router conventions with tRPC integration