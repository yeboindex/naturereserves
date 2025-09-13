# Research: NatureReserves.co.za Technical Decisions

## Testing Strategy

**Decision**: Jest + React Testing Library for unit/component tests, Playwright for E2E, Vitest for API route testing
**Rationale**: 
- Jest/RTL: Standard React testing stack with excellent Next.js integration
- Playwright: Superior E2E testing with cross-browser support and mobile testing
- Vitest: Fast testing for API routes and server-side logic

**Alternatives considered**:
- Cypress (slower than Playwright, less mobile testing)
- Testing Library alternatives (Enzyme - outdated, React Testing Library is current standard)

## Performance Targets

**Decision**: 
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Mobile performance: Lighthouse score > 90
- API responses: < 200ms p95 for search, < 500ms for complex queries
- SEO: Server-side rendering with Next.js App Router

**Rationale**: Google Core Web Vitals are critical for SEO ranking, especially for a directory site. Mobile performance is essential for tourism/travel use cases.

**Alternatives considered**:
- Client-side rendering only (poor SEO)
- Static generation only (not suitable for dynamic user content)

## Data Scraping Compliance & Rate Limits

**Decision**: 
- DataForSEO API: 1000 requests/month starter plan, escalate based on usage
- Respect robots.txt and implement exponential backoff
- Cache scraped data for 24-48 hours to minimize API calls
- Implement queue system for batch processing

**Rationale**: DataForSEO provides legitimate, compliant access to Google Maps data without violating ToS

**Alternatives considered**:
- Direct scraping (high risk of being blocked, legal concerns)
- Manual data entry only (not scalable)
- Other APIs (Places API more expensive, limited review data)

## Expected Scale & User Volume

**Decision**: 
- Initial target: 500-1000 reserves, 2000-5000 properties
- Expected users: 10k monthly unique visitors (year 1), 50k (year 2)
- Database sizing: 100GB storage allocation, connection pooling for serverless
- CDN strategy: Vercel Edge Network for image and asset delivery

**Rationale**: Conservative estimates based on South African tourism market size and digital adoption rates

**Alternatives considered**:
- Larger initial scale (premature optimization)
- Smaller scale (insufficient for monetization goals)

## Authentication & User Management

**Decision**: NextAuth.js with multiple providers (Google, email/password, potential Facebook)
**Rationale**: 
- Seamless integration with Next.js
- Multiple provider support for different user types
- Built-in security best practices

**Alternatives considered**:
- Supabase Auth (good but adds dependency)
- Custom JWT implementation (security risks)
- Auth0 (additional cost)

## State Management

**Decision**: React Server Components + Zustand for client state
**Rationale**:
- Server Components reduce client-side JavaScript
- Zustand is lightweight and sufficient for this use case
- Reduces complexity compared to Redux

**Alternatives considered**:
- Redux Toolkit (overkill for this application)
- React Context only (performance concerns for large data sets)
- TanStack Query (good for caching but Server Components handle most needs)

## Image Storage & Processing

**Decision**: Vercel Blob Storage with Next.js Image optimization
**Rationale**: 
- Integrated with Vercel deployment
- Automatic WebP/AVIF conversion
- Responsive image generation

**Alternatives considered**:
- Cloudinary (additional service, cost)
- AWS S3 (more complex setup)
- Database storage (poor performance)

## Search Implementation

**Decision**: PostgreSQL full-text search with pg_trgm extension for fuzzy matching
**Rationale**:
- Native to PostgreSQL, no additional services
- Handles location-based and text search
- Good performance for expected scale

**Alternatives considered**:
- Elasticsearch (overkill, additional infrastructure)
- Algolia (external dependency, cost)
- Simple SQL LIKE queries (poor performance, limited features)

## API Design

**Decision**: Next.js API Routes with tRPC for type-safe client-server communication
**Rationale**:
- End-to-end type safety
- Excellent developer experience
- Integrates seamlessly with Next.js

**Alternatives considered**:
- REST API only (less type safety)
- GraphQL (added complexity for this use case)
- Server Actions only (limited for complex operations)