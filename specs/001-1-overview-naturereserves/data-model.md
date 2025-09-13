# Data Model: NatureReserves.co.za

## Core Entities

### Reserve
**Purpose**: Represents a nature reserve/protected area
**Fields**:
- `id`: UUID (primary key)
- `name`: String (required, indexed)
- `slug`: String (unique, SEO-friendly URL)
- `description`: Text
- `location`: JSON (lat/lng coordinates)
- `address`: String
- `province`: Enum (9 SA provinces)
- `contact_email`: String (optional)
- `contact_phone`: String (optional)
- `website_url`: String (optional)
- `operating_status`: Enum (open, closed, seasonal, restricted)
- `established_date`: Date (optional)
- `area_size_hectares`: Integer (optional)
- `governing_body_id`: UUID (foreign key to User)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `scraped_at`: Timestamp (last data scrape)
- `verification_status`: Enum (unverified, pending, verified, flagged)
- `average_rating`: Decimal (computed from reviews)
- `review_count`: Integer (computed)
- `is_premium`: Boolean (premium listing status)

**Relationships**:
- One-to-many: Properties (accommodations within reserve)
- One-to-many: Reviews
- One-to-many: ReserveActivities
- One-to-many: ReserveFacilities
- Many-to-one: User (governing body)
- One-to-many: ScrapedData

**Validation Rules**:
- Name must be 3-200 characters
- Province must be valid SA province
- Location coordinates must be within SA boundaries
- Website URL must be valid HTTP/HTTPS

### Property  
**Purpose**: Accommodation within or near reserves
**Fields**:
- `id`: UUID (primary key)
- `name`: String (required)
- `slug`: String (unique, SEO-friendly)
- `description`: Text
- `property_type`: Enum (lodge, guesthouse, camping, glamping, rental, other)
- `reserve_id`: UUID (foreign key, optional - can be independent)
- `owner_id`: UUID (foreign key to User)
- `location`: JSON (lat/lng coordinates)
- `address`: String
- `contact_email`: String
- `contact_phone`: String
- `website_url`: String (optional)
- `booking_url`: String (external booking link)
- `price_range`: Enum (budget, mid_range, luxury, ultra_luxury)
- `capacity_guests`: Integer
- `capacity_units`: Integer (rooms/sites/units)
- `check_in_time`: Time (optional)
- `check_out_time`: Time (optional)
- `minimum_stay_nights`: Integer (default 1)
- `cancellation_policy`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `is_active`: Boolean
- `is_premium`: Boolean
- `verification_status`: Enum (unverified, pending, verified, flagged)
- `average_rating`: Decimal (computed)
- `review_count`: Integer (computed)

**Relationships**:
- Many-to-one: Reserve (optional)
- Many-to-one: User (owner)
- One-to-many: Reviews
- One-to-many: PropertyAmenities
- One-to-many: PropertyImages

**Validation Rules**:
- Name must be 3-200 characters
- Capacity must be > 0
- Price range must be valid enum
- Booking URL must be valid HTTP/HTTPS

### User
**Purpose**: Platform users (guests, property owners, governing bodies)
**Fields**:
- `id`: UUID (primary key)
- `email`: String (unique, required)
- `email_verified`: Boolean
- `name`: String
- `user_type`: Enum (guest, property_owner, governing_body, admin)
- `profile_image_url`: String (optional)
- `organization_name`: String (optional, for governing bodies)
- `phone`: String (optional)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `last_login_at`: Timestamp
- `is_active`: Boolean
- `email_notifications`: Boolean
- `marketing_emails`: Boolean

**Relationships**:
- One-to-many: Properties (as owner)
- One-to-many: Reserves (as governing body)
- One-to-many: Reviews (as author)
- One-to-many: UserSessions

**Validation Rules**:
- Email must be valid format
- User type must be valid enum
- Organization name required for governing bodies

### Review
**Purpose**: User-generated reviews for reserves and properties
**Fields**:
- `id`: UUID (primary key)
- `author_id`: UUID (foreign key to User)
- `reserve_id`: UUID (foreign key, optional)
- `property_id`: UUID (foreign key, optional)
- `rating`: Integer (1-5, required)
- `title`: String (optional, max 100 chars)
- `content`: Text (max 2000 chars)
- `visit_date`: Date (when they visited)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `is_verified`: Boolean (verified stay/visit)
- `is_flagged`: Boolean (flagged for review)
- `moderation_status`: Enum (pending, approved, rejected, removed)
- `helpful_count`: Integer (user votes)
- `ai_sentiment`: Enum (positive, neutral, negative, mixed)
- `ai_summary`: Text (AI-generated summary)

**Relationships**:
- Many-to-one: User (author)
- Many-to-one: Reserve (optional)
- Many-to-one: Property (optional)
- One-to-many: ReviewImages

**Validation Rules**:
- Must have either reserve_id or property_id (not both)
- Rating must be 1-5
- Content must be 10-2000 characters if provided
- Visit date must be in the past

## Supporting Entities

### Activity
**Purpose**: Activities available at reserves
**Fields**:
- `id`: UUID (primary key)
- `name`: String (unique)
- `category`: Enum (wildlife_viewing, hiking, water_sports, cultural, adventure, photography)
- `description`: Text
- `icon`: String (icon identifier)

### ReserveActivity
**Purpose**: Junction table for reserve-activity relationships
**Fields**:
- `reserve_id`: UUID (foreign key)
- `activity_id`: UUID (foreign key)
- `is_featured`: Boolean
- `season_availability`: JSON (seasonal information)
- `additional_cost`: Decimal (optional)
- `booking_required`: Boolean

### Facility
**Purpose**: Facilities available at reserves/properties
**Fields**:
- `id`: UUID (primary key)
- `name`: String (unique)
- `category`: Enum (accommodation, dining, recreation, services, accessibility)
- `icon`: String

### ReserveFacility / PropertyAmenity
**Purpose**: Junction tables for facility relationships
**Fields**:
- `reserve_id`/`property_id`: UUID (foreign key)
- `facility_id`: UUID (foreign key)
- `is_available`: Boolean
- `notes`: Text (optional)

### ScrapedData
**Purpose**: Track data scraping operations and results
**Fields**:
- `id`: UUID (primary key)
- `reserve_id`: UUID (foreign key)
- `data_source`: Enum (dataForSEO, manual, google_places)
- `scraped_at`: Timestamp
- `data_payload`: JSON (raw scraped data)
- `status`: Enum (success, partial, failed)
- `error_message`: Text (optional)

### Advertisement
**Purpose**: Paid advertising placements
**Fields**:
- `id`: UUID (primary key)
- `title`: String
- `content`: Text
- `image_url`: String
- `target_url`: String
- `advertiser_name`: String
- `placement_type`: Enum (banner, sponsored_listing, featured_content)
- `target_audience`: JSON (targeting criteria)
- `start_date`: Date
- `end_date`: Date
- `budget_daily`: Decimal
- `is_active`: Boolean
- `click_count`: Integer
- `impression_count`: Integer

## Computed Fields & Indexes

### Indexes
- `reserves`: name, province, location (GiST), verification_status, is_premium
- `properties`: name, reserve_id, property_type, is_premium
- `users`: email (unique), user_type
- `reviews`: reserve_id, property_id, created_at, moderation_status

### Computed Fields
- Average ratings: Computed from approved reviews
- Review counts: Count of approved reviews
- Distance calculations: PostGIS functions for location-based queries

## State Transitions

### Review Moderation
1. `pending` → AI analysis → `approved`/`rejected`
2. `approved` → user reports → `flagged` → manual review → `approved`/`removed`
3. Any state → admin action → any state

### Verification Status
1. `unverified` → governing body claim → `pending`
2. `pending` → verification process → `verified`
3. `verified` → data conflicts → `flagged` → review → `verified`/`unverified`