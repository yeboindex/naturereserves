# API Contract: NatureReserves.co.za

## Base Configuration
- **Protocol**: HTTP/HTTPS
- **Base URL**: `https://naturereserves.co.za/api`
- **Authentication**: NextAuth.js session-based
- **Content-Type**: `application/json`
- **Rate Limiting**: 100 requests/minute per IP

## Public Endpoints (No Authentication Required)

### GET /reserves
**Purpose**: Search and list reserves
**Parameters**:
```typescript
{
  search?: string;           // Search term (name, description)
  province?: string;         // SA province filter
  activities?: string[];     // Activity IDs
  location?: {              // Geographic search
    lat: number;
    lng: number;
    radius: number;          // km radius
  };
  sort?: 'name' | 'rating' | 'distance';
  order?: 'asc' | 'desc';
  page?: number;             // Default: 1
  limit?: number;            // Default: 20, max: 100
}
```
**Response**:
```typescript
{
  data: {
    id: string;
    name: string;
    slug: string;
    description: string;
    location: { lat: number; lng: number };
    address: string;
    province: string;
    averageRating: number;
    reviewCount: number;
    isPremium: boolean;
    activities: { id: string; name: string }[];
    facilities: { id: string; name: string }[];
    images: string[];
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

### GET /reserves/{slug}
**Purpose**: Get detailed reserve information
**Response**:
```typescript
{
  id: string;
  name: string;
  slug: string;
  description: string;
  location: { lat: number; lng: number };
  address: string;
  province: string;
  contactEmail?: string;
  contactPhone?: string;
  websiteUrl?: string;
  operatingStatus: 'open' | 'closed' | 'seasonal' | 'restricted';
  establishedDate?: string;
  areaSizeHectares?: number;
  averageRating: number;
  reviewCount: number;
  isPremium: boolean;
  activities: {
    id: string;
    name: string;
    category: string;
    isFeatured: boolean;
    seasonAvailability?: object;
    additionalCost?: number;
  }[];
  facilities: { id: string; name: string; category: string }[];
  properties: {
    id: string;
    name: string;
    slug: string;
    propertyType: string;
    priceRange: string;
    averageRating: number;
  }[];
  images: string[];
  reviews: {
    id: string;
    authorName: string;
    rating: number;
    title?: string;
    content?: string;
    visitDate: string;
    createdAt: string;
    isVerified: boolean;
  }[];
}
```

### GET /properties
**Purpose**: Search and list properties
**Parameters**: Similar to reserves with additional filters:
```typescript
{
  // ... base search parameters
  propertyType?: string[];
  priceRange?: string[];
  capacity?: number;
  reserveId?: string;      // Filter by specific reserve
}
```

### GET /properties/{slug}
**Purpose**: Get detailed property information
**Response**: Detailed property object with reserve information, amenities, reviews

### GET /activities
**Purpose**: List all available activities
**Response**:
```typescript
{
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
}[]
```

### GET /provinces
**Purpose**: List South African provinces
**Response**:
```typescript
{
  code: string;
  name: string;
}[]
```

## Protected Endpoints (Authentication Required)

### POST /reviews
**Purpose**: Submit a review for a reserve or property
**Authorization**: Must be logged in as guest or verified user
**Body**:
```typescript
{
  reserveId?: string;      // Either reserveId or propertyId required
  propertyId?: string;
  rating: number;          // 1-5
  title?: string;
  content?: string;
  visitDate: string;       // ISO date
  images?: File[];         // Uploaded images
}
```
**Response**:
```typescript
{
  id: string;
  status: 'pending' | 'approved';
  message: string;
}
```

### GET /user/reviews
**Purpose**: Get current user's reviews
**Response**: Array of review objects with status

### PUT /reviews/{id}
**Purpose**: Edit user's own review
**Authorization**: Must be review author
**Body**: Same as POST /reviews

### DELETE /reviews/{id}
**Purpose**: Delete user's own review
**Authorization**: Must be review author

## Property Owner Endpoints

### POST /properties
**Purpose**: Create new property listing
**Authorization**: Must be property_owner user type
**Body**:
```typescript
{
  name: string;
  description: string;
  propertyType: string;
  reserveId?: string;
  location: { lat: number; lng: number };
  address: string;
  contactEmail: string;
  contactPhone: string;
  websiteUrl?: string;
  bookingUrl?: string;
  priceRange: string;
  capacityGuests: number;
  capacityUnits: number;
  checkInTime?: string;
  checkOutTime?: string;
  minimumStayNights?: number;
  cancellationPolicy?: string;
  amenities: string[];     // Amenity IDs
  images: File[];
}
```

### PUT /properties/{id}
**Purpose**: Update property listing
**Authorization**: Must be property owner

### GET /user/properties
**Purpose**: Get user's property listings with analytics
**Response**: Properties with view counts, click stats, etc.

### POST /properties/{id}/premium
**Purpose**: Upgrade property to premium listing
**Body**:
```typescript
{
  duration: number;        // months
  paymentMethod: string;
}
```

## Governing Body Endpoints

### GET /admin/reserves
**Purpose**: Get reserves managed by governing body
**Authorization**: Must be governing_body user type

### PUT /reserves/{id}/verify
**Purpose**: Verify or approve reserve information
**Body**:
```typescript
{
  verificationStatus: 'verified' | 'flagged';
  notes?: string;
}
```

### POST /reserves/{id}/response
**Purpose**: Respond to reviews on behalf of reserve
**Body**:
```typescript
{
  reviewId: string;
  response: string;
}
```

## Admin Endpoints

### GET /admin/dashboard
**Purpose**: Admin analytics and overview
**Authorization**: Must be admin user type

### GET /admin/reviews/pending
**Purpose**: Get reviews pending moderation

### PUT /admin/reviews/{id}/moderate
**Purpose**: Approve/reject review
**Body**:
```typescript
{
  status: 'approved' | 'rejected' | 'removed';
  reason?: string;
}
```

### POST /admin/scrape/trigger
**Purpose**: Trigger scraping job for reserves
**Body**:
```typescript
{
  reserveIds?: string[];   // Specific reserves or all
  dataSource: 'dataForSEO' | 'google_places';
}
```

## Error Responses

All endpoints return errors in consistent format:
```typescript
{
  error: {
    code: string;          // Machine-readable error code
    message: string;       // Human-readable message
    details?: object;      // Additional error context
  };
}
```

**Common Error Codes**:
- `VALIDATION_ERROR`: Invalid input data
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limiting

- Public endpoints: 100 requests/minute per IP
- Authenticated endpoints: 200 requests/minute per user
- File uploads: 10 requests/minute per user
- Search endpoints: 50 requests/minute per IP

## Webhooks (Future)

### POST /webhooks/payment
**Purpose**: Handle payment confirmations for premium listings

### POST /webhooks/scraping
**Purpose**: Handle scraping job completion notifications