import { z } from 'zod';
import { ActivityCategory } from '@prisma/client';

export const ActivityCreateSchema = z.object({
  name: z.string().min(2).max(100),
  category: z.nativeEnum(ActivityCategory),
  description: z.string().optional(),
  icon: z.string().optional(),
});

export const ActivityUpdateSchema = ActivityCreateSchema.partial().extend({
  id: z.string(),
});

export const ReserveActivityCreateSchema = z.object({
  reserveId: z.string(),
  activityId: z.string(),
  isFeatured: z.boolean().default(false),
  seasonAvailability: z.object({
    allYear: z.boolean().optional(),
    months: z.array(z.number().min(1).max(12)).optional(),
    notes: z.string().optional(),
  }).optional(),
  additionalCost: z.number().min(0).optional(),
  bookingRequired: z.boolean().default(false),
});

export const ReserveActivityUpdateSchema = ReserveActivityCreateSchema.partial().extend({
  reserveId: z.string(),
  activityId: z.string(),
});

export const ActivitySearchSchema = z.object({
  category: z.nativeEnum(ActivityCategory).optional(),
  featured: z.boolean().optional(),
  reserveId: z.string().optional(),
});

export type ActivityCreate = z.infer<typeof ActivityCreateSchema>;
export type ActivityUpdate = z.infer<typeof ActivityUpdateSchema>;
export type ReserveActivityCreate = z.infer<typeof ReserveActivityCreateSchema>;
export type ReserveActivityUpdate = z.infer<typeof ReserveActivityUpdateSchema>;
export type ActivitySearch = z.infer<typeof ActivitySearchSchema>;

export class ActivityModel {
  static validateCreate(data: unknown) {
    return ActivityCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return ActivityUpdateSchema.parse(data);
  }

  static validateReserveActivityCreate(data: unknown) {
    return ReserveActivityCreateSchema.parse(data);
  }

  static validateReserveActivityUpdate(data: unknown) {
    return ReserveActivityUpdateSchema.parse(data);
  }

  static validateSearch(data: unknown) {
    return ActivitySearchSchema.parse(data);
  }

  static getActivityIcon(category: ActivityCategory): string {
    const icons = {
      [ActivityCategory.WILDLIFE_VIEWING]: 'binoculars',
      [ActivityCategory.HIKING]: 'hiking',
      [ActivityCategory.WATER_SPORTS]: 'waves',
      [ActivityCategory.CULTURAL]: 'culture',
      [ActivityCategory.ADVENTURE]: 'mountain',
      [ActivityCategory.PHOTOGRAPHY]: 'camera',
    };
    return icons[category] || 'activity';
  }

  static isActivityAvailable(
    seasonAvailability: { allYear?: boolean; months?: number[] } | null,
    currentMonth: number
  ): boolean {
    if (!seasonAvailability || seasonAvailability.allYear) {
      return true;
    }

    if (seasonAvailability.months) {
      return seasonAvailability.months.includes(currentMonth);
    }

    return true; // Default to available if no specific restrictions
  }

  static getSeasonalDescription(seasonAvailability: {
    allYear?: boolean;
    months?: number[];
    notes?: string;
  } | null): string {
    if (!seasonAvailability || seasonAvailability.allYear) {
      return 'Available year-round';
    }

    if (seasonAvailability.notes) {
      return seasonAvailability.notes;
    }

    if (seasonAvailability.months && seasonAvailability.months.length > 0) {
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ];
      const availableMonths = seasonAvailability.months
        .map(month => monthNames[month - 1])
        .join(', ');
      return `Available: ${availableMonths}`;
    }

    return 'Seasonal availability varies';
  }

  static categorizeActivities(activities: Array<{
    id: string;
    name: string;
    category: ActivityCategory;
  }>) {
    const categorized: Record<ActivityCategory, typeof activities> = {
      [ActivityCategory.WILDLIFE_VIEWING]: [],
      [ActivityCategory.HIKING]: [],
      [ActivityCategory.WATER_SPORTS]: [],
      [ActivityCategory.CULTURAL]: [],
      [ActivityCategory.ADVENTURE]: [],
      [ActivityCategory.PHOTOGRAPHY]: [],
    };

    activities.forEach(activity => {
      categorized[activity.category].push(activity);
    });

    return categorized;
  }

  static calculateActivityScore(activity: {
    isFeatured: boolean;
    additionalCost?: number | null;
    bookingRequired: boolean;
  }): number {
    let score = 0;
    
    if (activity.isFeatured) score += 10;
    if (!activity.additionalCost || activity.additionalCost === 0) score += 5;
    if (!activity.bookingRequired) score += 3;

    return score;
  }
}