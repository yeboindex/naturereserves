import { z } from 'zod';
import { PropertyType, PriceRange, VerificationStatus } from '@prisma/client';
import { LocationSchema } from './reserve';

export const PropertyCreateSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase kebab-case'),
  description: z.string().optional(),
  propertyType: z.nativeEnum(PropertyType),
  reserveId: z.string().optional(),
  ownerId: z.string(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  websiteUrl: z.string().url().optional(),
  bookingUrl: z.string().url().optional(),
  priceRange: z.nativeEnum(PriceRange).optional(),
  capacityGuests: z.number().positive().optional(),
  capacityUnits: z.number().positive().optional(),
  checkInTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  checkOutTime: z.string().regex(/^\d{2}:\d{2}$/).optional(),
  minimumStayNights: z.number().min(1).default(1),
  cancellationPolicy: z.string().optional(),
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
});

export const PropertyUpdateSchema = PropertyCreateSchema.partial().extend({
  id: z.string(),
});

export const PropertySearchSchema = z.object({
  search: z.string().optional(),
  propertyType: z.array(z.nativeEnum(PropertyType)).optional(),
  priceRange: z.array(z.nativeEnum(PriceRange)).optional(),
  capacity: z.number().positive().optional(),
  reserveId: z.string().optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(500),
  }).optional(),
  sort: z.enum(['name', 'rating', 'distance', 'price']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const PropertyPremiumUpgradeSchema = z.object({
  id: z.string(),
  duration: z.number().min(1).max(24), // months
  paymentMethod: z.string(),
});

export type PropertyCreate = z.infer<typeof PropertyCreateSchema>;
export type PropertyUpdate = z.infer<typeof PropertyUpdateSchema>;
export type PropertySearch = z.infer<typeof PropertySearchSchema>;
export type PropertyPremiumUpgrade = z.infer<typeof PropertyPremiumUpgradeSchema>;

export class PropertyModel {
  static validateCreate(data: unknown) {
    return PropertyCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return PropertyUpdateSchema.parse(data);
  }

  static validateSearch(data: unknown) {
    return PropertySearchSchema.parse(data);
  }

  static validatePremiumUpgrade(data: unknown) {
    return PropertyPremiumUpgradeSchema.parse(data);
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static validateCapacity(guests: number, units: number): boolean {
    return guests > 0 && units > 0 && guests >= units;
  }

  static calculatePremiumPrice(duration: number): number {
    const basePrice = 299; // ZAR per month
    const discounts = {
      3: 0.05,  // 5% discount for 3+ months
      6: 0.10,  // 10% discount for 6+ months
      12: 0.15, // 15% discount for 12+ months
    };

    let discount = 0;
    if (duration >= 12) discount = discounts[12];
    else if (duration >= 6) discount = discounts[6];
    else if (duration >= 3) discount = discounts[3];

    return Math.round(basePrice * duration * (1 - discount));
  }

  static getPremiumExpiryDate(duration: number): Date {
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);
    return expiryDate;
  }
}