import { z } from 'zod';
import { FacilityCategory } from '@prisma/client';

export const FacilityCreateSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.nativeEnum(FacilityCategory),
  icon: z.string().optional(),
});

export const FacilityUpdateSchema = FacilityCreateSchema.partial().extend({
  id: z.string(),
});

export const ReserveFacilityCreateSchema = z.object({
  reserveId: z.string(),
  facilityId: z.string(),
  isAvailable: z.boolean().default(true),
  notes: z.string().optional(),
});

export const ReserveFacilityUpdateSchema = ReserveFacilityCreateSchema.partial().extend({
  reserveId: z.string(),
  facilityId: z.string(),
});

export const PropertyAmenityCreateSchema = z.object({
  propertyId: z.string(),
  facilityId: z.string(),
  isAvailable: z.boolean().default(true),
  notes: z.string().optional(),
});

export const PropertyAmenityUpdateSchema = PropertyAmenityCreateSchema.partial().extend({
  propertyId: z.string(),
  facilityId: z.string(),
});

export const FacilitySearchSchema = z.object({
  category: z.nativeEnum(FacilityCategory).optional(),
  available: z.boolean().optional(),
});

export type FacilityCreate = z.infer<typeof FacilityCreateSchema>;
export type FacilityUpdate = z.infer<typeof FacilityUpdateSchema>;
export type ReserveFacilityCreate = z.infer<typeof ReserveFacilityCreateSchema>;
export type ReserveFacilityUpdate = z.infer<typeof ReserveFacilityUpdateSchema>;
export type PropertyAmenityCreate = z.infer<typeof PropertyAmenityCreateSchema>;
export type PropertyAmenityUpdate = z.infer<typeof PropertyAmenityUpdateSchema>;
export type FacilitySearch = z.infer<typeof FacilitySearchSchema>;

export class FacilityModel {
  static validateCreate(data: unknown) {
    return FacilityCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return FacilityUpdateSchema.parse(data);
  }

  static validateReserveFacilityCreate(data: unknown) {
    return ReserveFacilityCreateSchema.parse(data);
  }

  static validateReserveFacilityUpdate(data: unknown) {
    return ReserveFacilityUpdateSchema.parse(data);
  }

  static validatePropertyAmenityCreate(data: unknown) {
    return PropertyAmenityCreateSchema.parse(data);
  }

  static validatePropertyAmenityUpdate(data: unknown) {
    return PropertyAmenityUpdateSchema.parse(data);
  }

  static validateSearch(data: unknown) {
    return FacilitySearchSchema.parse(data);
  }

  static getFacilityIcon(category: FacilityCategory): string {
    const icons = {
      [FacilityCategory.ACCOMMODATION]: 'bed',
      [FacilityCategory.DINING]: 'utensils',
      [FacilityCategory.RECREATION]: 'activity',
      [FacilityCategory.SERVICES]: 'service',
      [FacilityCategory.ACCESSIBILITY]: 'wheelchair',
    };
    return icons[category] || 'facility';
  }

  static categorizeFacilities(facilities: Array<{
    id: string;
    name: string;
    category: FacilityCategory;
    isAvailable?: boolean;
  }>) {
    const categorized: Record<FacilityCategory, typeof facilities> = {
      [FacilityCategory.ACCOMMODATION]: [],
      [FacilityCategory.DINING]: [],
      [FacilityCategory.RECREATION]: [],
      [FacilityCategory.SERVICES]: [],
      [FacilityCategory.ACCESSIBILITY]: [],
    };

    facilities
      .filter(facility => facility.isAvailable !== false)
      .forEach(facility => {
        categorized[facility.category].push(facility);
      });

    return categorized;
  }

  static getEssentialFacilities(): string[] {
    return [
      'Parking',
      'Restrooms',
      'Information Center',
      'First Aid',
      'Emergency Contact',
    ];
  }

  static getAccessibilityFacilities(): string[] {
    return [
      'Wheelchair Access',
      'Disabled Parking',
      'Accessible Restrooms',
      'Braille Signage',
      'Audio Tours',
    ];
  }

  static calculateFacilityScore(facilities: Array<{
    category: FacilityCategory;
    isAvailable: boolean;
  }>): number {
    const categoryWeights = {
      [FacilityCategory.ACCESSIBILITY]: 10,
      [FacilityCategory.SERVICES]: 8,
      [FacilityCategory.DINING]: 6,
      [FacilityCategory.RECREATION]: 5,
      [FacilityCategory.ACCOMMODATION]: 7,
    };

    return facilities
      .filter(facility => facility.isAvailable)
      .reduce((score, facility) => {
        return score + categoryWeights[facility.category];
      }, 0);
  }

  static getFacilityPriority(category: FacilityCategory): number {
    const priorities = {
      [FacilityCategory.ACCESSIBILITY]: 1,
      [FacilityCategory.SERVICES]: 2,
      [FacilityCategory.DINING]: 3,
      [FacilityCategory.ACCOMMODATION]: 4,
      [FacilityCategory.RECREATION]: 5,
    };
    return priorities[category];
  }

  static filterAvailableFacilities<T extends { isAvailable?: boolean }>(
    facilities: T[]
  ): T[] {
    return facilities.filter(facility => facility.isAvailable !== false);
  }

  static groupFacilitiesByCategory<T extends { category: FacilityCategory; isAvailable?: boolean }>(
    facilities: T[]
  ): Record<string, T[]> {
    const available = this.filterAvailableFacilities(facilities);
    
    return available.reduce((groups, facility) => {
      const categoryKey = facility.category.toLowerCase().replace('_', ' ');
      if (!groups[categoryKey]) {
        groups[categoryKey] = [];
      }
      groups[categoryKey].push(facility);
      return groups;
    }, {} as Record<string, T[]>);
  }
}