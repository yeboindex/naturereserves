# Quickstart Guide: NatureReserves.co.za

## Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+ (or Supabase/Neon account)
- Git

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd naturereserves

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database and API keys

# Set up database
npm run db:setup
npm run db:migrate
npm run db:seed

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/naturereserves"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Data Scraping
DATAFORSEO_LOGIN="your-dataforseo-login"
DATAFORSEO_PASSWORD="your-dataforseo-password"

# AI Integration
OPENAI_API_KEY="your-openai-api-key"

# File Storage
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

## Key User Flows

### 1. Guest Searching for Reserves
**Scenario**: Tourist wants to find bird-watching reserves near Cape Town

1. Visit homepage
2. Enter "Cape Town" in location search
3. Select "Bird Watching" from activities filter
4. Browse filtered results
5. Click on a reserve to view details
6. Read reviews and view photos
7. Click booking link to external system

**API Calls**:
```bash
GET /api/reserves?search=Cape%20Town&activities=bird-watching&sort=rating
GET /api/reserves/kruger-national-park
```

**Expected Result**: User finds suitable reserves and successfully navigates to booking

### 2. Property Owner Creating Listing
**Scenario**: Lodge owner wants to list their accommodation

1. Sign up/login as property owner
2. Navigate to "Add Property" page
3. Fill in property details form
4. Upload property images
5. Link to nearby reserve (optional)
6. Add amenities and pricing info
7. Submit for approval
8. Receive confirmation and tracking dashboard

**API Calls**:
```bash
POST /api/auth/register
POST /api/properties
PUT /api/properties/{id}
GET /api/user/properties
```

**Expected Result**: Property is listed and visible to potential guests

### 3. Governing Body Managing Reserve Info
**Scenario**: SANParks wants to update Kruger National Park information

1. Login with governing body account
2. Access admin dashboard
3. Find Kruger National Park in managed reserves
4. Review and verify current information
5. Update operating hours and seasonal closures
6. Respond to recent visitor reviews
7. Monitor listing performance

**API Calls**:
```bash
GET /api/admin/reserves
PUT /api/reserves/{id}/verify
POST /api/reserves/{id}/response
GET /api/admin/dashboard
```

**Expected Result**: Reserve information is accurate and up-to-date

## Testing Scenarios

### Functional Tests

1. **Search Functionality**
   - Search by location returns relevant results
   - Activity filters work correctly
   - Pagination handles large result sets
   - Search handles edge cases (no results, special characters)

2. **User Authentication**
   - Registration process completes successfully
   - Login redirects to intended page
   - Protected routes require authentication
   - User roles enforce correct permissions

3. **Review System**
   - Users can submit reviews with ratings
   - Reviews appear after moderation
   - Review editing works for authors
   - Inappropriate content gets flagged

4. **Property Management**
   - Property owners can create listings
   - Image upload and processing works
   - Premium upgrades function correctly
   - Analytics data displays accurately

### Performance Tests

1. **Page Load Speed**
   - Homepage loads < 2s on 3G
   - Reserve detail pages load < 3s
   - Search results appear < 1s
   - Images load progressively

2. **Database Performance**
   - Complex searches complete < 500ms
   - Concurrent user handling
   - Full-text search efficiency
   - Geographic queries perform well

3. **Mobile Responsiveness**
   - Touch targets are appropriately sized
   - Text is readable without zooming
   - Navigation works on small screens
   - Forms are mobile-friendly

### Integration Tests

1. **Data Scraping Pipeline**
   - DataForSEO API integration works
   - Scraped data maps to database correctly
   - Duplicate detection prevents data pollution
   - Error handling manages API failures

2. **AI Content Processing**
   - Review sentiment analysis is accurate
   - Content moderation flags inappropriate content
   - Summary generation is helpful
   - Feature extraction identifies key attributes

3. **External Integrations**
   - Booking links redirect correctly
   - Payment processing for premium features
   - Email notifications send properly
   - Social media sharing functions

## Database Seed Data

### Sample Reserves
- Kruger National Park (premium, verified)
- Table Mountain National Park (verified)
- Addo Elephant National Park (basic listing)
- Hluhluwe-iMfolozi Park (with properties)
- Pilanesberg National Park (seasonal)

### Sample Properties
- Luxury safari lodge in Kruger
- Budget guesthouse near Addo
- Camping site in Drakensberg
- Glamping pods at Hermanus
- Mountain hut at Table Mountain

### Sample Users
- Admin user (full access)
- SANParks governing body account
- Property owner with multiple listings
- Regular guest with review history
- New user (minimal data)

### Sample Reviews
- Mix of ratings (1-5 stars)
- Various visit dates and seasons
- Different user types and experiences
- Some flagged content for testing moderation

## Deployment Checklist

### Pre-deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Image optimization enabled
- [ ] SEO meta tags configured
- [ ] Analytics tracking setup

### Production Setup
- [ ] Vercel deployment configured
- [ ] Database backup strategy
- [ ] Domain and SSL configured
- [ ] CDN and caching setup
- [ ] Error monitoring enabled
- [ ] Performance monitoring active

### Post-deployment
- [ ] Smoke tests on production
- [ ] Search functionality verified
- [ ] User registration working
- [ ] Payment processing tested
- [ ] Mobile experience validated
- [ ] SEO crawlability confirmed

## Monitoring & Maintenance

### Daily Checks
- Application uptime and response times
- Database performance metrics
- Error rates and exceptions
- User registration and login success rates

### Weekly Tasks
- Review and moderate user content
- Update scraped data for active reserves
- Monitor premium listing performance
- Analyze user engagement metrics

### Monthly Reviews
- Performance optimization opportunities
- User feedback and feature requests
- Content quality and accuracy
- Revenue and conversion metrics