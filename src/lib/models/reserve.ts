import { z } from 'zod';
import { Province, OperatingStatus, VerificationStatus } from '@prisma/client';

// South Africa boundaries validation
const SA_BOUNDS = {
  north: -16.4,
  south: -34.8,
  east: 32.9,
  west: 16.5,
};

export const LocationSchema = z.object({
  lat: z.number().min(SA_BOUNDS.south).max(SA_BOUNDS.north),
  lng: z.number().min(SA_BOUNDS.west).max(SA_BOUNDS.east),
});

export const ReserveCreateSchema = z.object({
  name: z.string().min(3).max(200),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must be lowercase kebab-case'),
  description: z.string().optional(),
  location: LocationSchema.optional(),
  address: z.string().optional(),
  province: z.nativeEnum(Province).optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  websiteUrl: z.string().url().optional(),
  operatingStatus: z.nativeEnum(OperatingStatus).default(OperatingStatus.OPEN),
  establishedDate: z.date().optional(),
  areaSizeHectares: z.number().positive().optional(),
  governingBodyId: z.string().optional(),
  isPremium: z.boolean().default(false),
});

export const ReserveUpdateSchema = ReserveCreateSchema.partial().extend({
  id: z.string(),
});

export const ReserveSearchSchema = z.object({
  search: z.string().optional(),
  province: z.nativeEnum(Province).optional(),
  activities: z.array(z.string()).optional(),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    radius: z.number().min(1).max(500), // km
  }).optional(),
  sort: z.enum(['name', 'rating', 'distance']).default('name'),
  order: z.enum(['asc', 'desc']).default('asc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

export const ReserveVerificationSchema = z.object({
  id: z.string(),
  verificationStatus: z.nativeEnum(VerificationStatus),
  notes: z.string().optional(),
});

export type ReserveCreate = z.infer<typeof ReserveCreateSchema>;
export type ReserveUpdate = z.infer<typeof ReserveUpdateSchema>;
export type ReserveSearch = z.infer<typeof ReserveSearchSchema>;
export type ReserveVerification = z.infer<typeof ReserveVerificationSchema>;
export type Location = z.infer<typeof LocationSchema>;

export class ReserveModel {
  static validateCreate(data: unknown) {
    return ReserveCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return ReserveUpdateSchema.parse(data);
  }

  static validateSearch(data: unknown) {
    return ReserveSearchSchema.parse(data);
  }

  static validateVerification(data: unknown) {
    return ReserveVerificationSchema.parse(data);
  }

  static generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  static isWithinSABounds(location: Location): boolean {
    return (
      location.lat >= SA_BOUNDS.south &&
      location.lat <= SA_BOUNDS.north &&
      location.lng >= SA_BOUNDS.west &&
      location.lng <= SA_BOUNDS.east
    );
  }

  static calculateDistance(
    point1: Location,
    point2: Location
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180;
    const dLon = (point2.lng - point1.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }
}