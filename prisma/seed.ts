import { PrismaClient } from '@prisma/client';
import {
  Province,
  ActivityCategory,
  FacilityCategory,
  UserType,
  PropertyType,
  PriceRange,
} from '@prisma/client';

const prisma = new PrismaClient();

async function seedActivities() {
  const activities = [
    {
      name: 'Game Drives',
      category: ActivityCategory.WILDLIFE_VIEWING,
      description: 'Guided vehicle tours to observe wildlife in their natural habitat',
      icon: 'binoculars',
    },
    {
      name: 'Bird Watching',
      category: ActivityCategory.WILDLIFE_VIEWING,
      description: 'Spotting and identifying various bird species',
      icon: 'bird',
    },
    {
      name: 'Hiking Trails',
      category: ActivityCategory.HIKING,
      description: 'Walking trails through natural landscapes',
      icon: 'hiking',
    },
    {
      name: 'Rock Climbing',
      category: ActivityCategory.ADVENTURE,
      description: 'Climbing natural rock formations',
      icon: 'mountain',
    },
    {
      name: 'Photography Tours',
      category: ActivityCategory.PHOTOGRAPHY,
      description: 'Guided tours focused on capturing wildlife and landscapes',
      icon: 'camera',
    },
    {
      name: 'Cultural Tours',
      category: ActivityCategory.CULTURAL,
      description: 'Learning about local history and culture',
      icon: 'culture',
    },
  ];

  for (const activity of activities) {
    await prisma.activity.upsert({
      where: { name: activity.name },
      update: {},
      create: activity,
    });
  }
}

async function seedFacilities() {
  const facilities = [
    {
      name: 'Restaurant',
      category: FacilityCategory.DINING,
      icon: 'utensils',
    },
    {
      name: 'Gift Shop',
      category: FacilityCategory.SERVICES,
      icon: 'shopping-bag',
    },
    {
      name: 'Parking',
      category: FacilityCategory.SERVICES,
      icon: 'car',
    },
    {
      name: 'Swimming Pool',
      category: FacilityCategory.RECREATION,
      icon: 'waves',
    },
    {
      name: 'Conference Hall',
      category: FacilityCategory.SERVICES,
      icon: 'presentation',
    },
    {
      name: 'Wheelchair Access',
      category: FacilityCategory.ACCESSIBILITY,
      icon: 'wheelchair',
    },
    {
      name: 'WiFi',
      category: FacilityCategory.SERVICES,
      icon: 'wifi',
    },
    {
      name: 'Air Conditioning',
      category: FacilityCategory.ACCOMMODATION,
      icon: 'snowflake',
    },
  ];

  for (const facility of facilities) {
    await prisma.facility.upsert({
      where: { name: facility.name },
      update: {},
      create: facility,
    });
  }
}

async function seedSampleData() {
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@naturereserves.co.za' },
    update: {},
    create: {
      email: 'admin@naturereserves.co.za',
      name: 'NatureReserves Admin',
      userType: UserType.ADMIN,
      emailVerified: true,
    },
  });

  // Create governing body user
  const governingBodyUser = await prisma.user.upsert({
    where: { email: 'sanparks@sanparks.org' },
    update: {},
    create: {
      email: 'sanparks@sanparks.org',
      name: 'SANParks Representative',
      userType: UserType.GOVERNING_BODY,
      organizationName: 'South African National Parks',
      emailVerified: true,
    },
  });

  // Create sample reserve
  const krugerspark = await prisma.reserve.upsert({
    where: { slug: 'kruger-national-park' },
    update: {},
    create: {
      name: 'Kruger National Park',
      slug: 'kruger-national-park',
      description: 'One of Africa\'s largest game reserves, home to the Big Five and countless other species.',
      location: { lat: -24.0078, lng: 31.4969 },
      address: 'Kruger National Park, South Africa',
      province: Province.MPUMALANGA,
      contactEmail: 'info@sanparks.org',
      contactPhone: '+27 13 735 4000',
      websiteUrl: 'https://www.sanparks.org/parks/kruger/',
      governingBodyId: governingBodyUser.id,
      establishedDate: new Date('1898-05-26'),
      areaSizeHectares: 1948528,
      verificationStatus: 'VERIFIED',
      averageRating: 4.8,
      reviewCount: 1250,
      isPremium: true,
    },
  });

  // Create property owner user
  const propertyOwner = await prisma.user.upsert({
    where: { email: 'owner@sabilodge.com' },
    update: {},
    create: {
      email: 'owner@sabilodge.com',
      name: 'Sabi Lodge Owner',
      userType: UserType.PROPERTY_OWNER,
      emailVerified: true,
    },
  });

  // Create sample property
  await prisma.property.upsert({
    where: { slug: 'sabi-sabi-lodge' },
    update: {},
    create: {
      name: 'Sabi Sabi Private Game Reserve',
      slug: 'sabi-sabi-lodge',
      description: 'Luxury safari lodge adjacent to Kruger National Park',
      propertyType: PropertyType.LODGE,
      reserveId: krugerspark.id,
      ownerId: propertyOwner.id,
      location: { lat: -24.4532, lng: 31.3265 },
      address: 'Sabi Sands Game Reserve, South Africa',
      contactEmail: 'reservations@sabisabi.com',
      contactPhone: '+27 11 447 7172',
      websiteUrl: 'https://www.sabisabi.com',
      bookingUrl: 'https://www.sabisabi.com/reservations',
      priceRange: PriceRange.ULTRA_LUXURY,
      capacityGuests: 56,
      capacityUnits: 28,
      checkInTime: '14:00',
      checkOutTime: '11:00',
      minimumStayNights: 2,
      verificationStatus: 'VERIFIED',
      averageRating: 4.9,
      reviewCount: 324,
      isPremium: true,
    },
  });

  console.log('Seed data created successfully!');
}

async function main() {
  console.log('Seeding database...');
  
  await seedActivities();
  console.log('✅ Activities seeded');
  
  await seedFacilities();
  console.log('✅ Facilities seeded');
  
  await seedSampleData();
  console.log('✅ Sample data seeded');
  
  console.log('🌱 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });