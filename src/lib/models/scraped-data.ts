import { z } from 'zod';
import { DataSource, ScrapingStatus } from '@prisma/client';

export const ScrapedDataCreateSchema = z.object({
  reserveId: z.string(),
  dataSource: z.nativeEnum(DataSource),
  dataPayload: z.record(z.any()),
  status: z.nativeEnum(ScrapingStatus),
  errorMessage: z.string().optional(),
});

export const ScrapedDataUpdateSchema = ScrapedDataCreateSchema.partial().extend({
  id: z.string(),
});

export const ScrapeJobSchema = z.object({
  reserveIds: z.array(z.string()).optional(),
  dataSource: z.nativeEnum(DataSource),
  priority: z.enum(['low', 'normal', 'high']).default('normal'),
  scheduledAt: z.date().optional(),
});

export const ScrapeResultSchema = z.object({
  jobId: z.string(),
  reserveId: z.string(),
  dataSource: z.nativeEnum(DataSource),
  success: z.boolean(),
  data: z.record(z.any()).optional(),
  error: z.string().optional(),
  processedAt: z.date(),
});

export type ScrapedDataCreate = z.infer<typeof ScrapedDataCreateSchema>;
export type ScrapedDataUpdate = z.infer<typeof ScrapedDataUpdateSchema>;
export type ScrapeJob = z.infer<typeof ScrapeJobSchema>;
export type ScrapeResult = z.infer<typeof ScrapeResultSchema>;

export class ScrapedDataModel {
  static validateCreate(data: unknown) {
    return ScrapedDataCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return ScrapedDataUpdateSchema.parse(data);
  }

  static validateScrapeJob(data: unknown) {
    return ScrapeJobSchema.parse(data);
  }

  static validateScrapeResult(data: unknown) {
    return ScrapeResultSchema.parse(data);
  }

  static isDataFresh(scrapedAt: Date, maxAgeHours: number = 24): boolean {
    const maxAge = new Date();
    maxAge.setHours(maxAge.getHours() - maxAgeHours);
    return scrapedAt > maxAge;
  }

  static shouldRescrape(lastScraped: Date | null, dataSource: DataSource): boolean {
    if (!lastScraped) return true;

    const freshnessThresholds = {
      [DataSource.DATA_FOR_SEO]: 7 * 24, // 7 days
      [DataSource.GOOGLE_PLACES]: 3 * 24, // 3 days
      [DataSource.MANUAL]: 30 * 24, // 30 days
    };

    const threshold = freshnessThresholds[dataSource];
    return !this.isDataFresh(lastScraped, threshold);
  }

  static extractUsefulData(
    dataPayload: Record<string, any>,
    dataSource: DataSource
  ): Record<string, any> {
    switch (dataSource) {
      case DataSource.DATA_FOR_SEO:
        return this.extractDataForSEOData(dataPayload);
      case DataSource.GOOGLE_PLACES:
        return this.extractGooglePlacesData(dataPayload);
      default:
        return dataPayload;
    }
  }

  private static extractDataForSEOData(data: Record<string, any>): Record<string, any> {
    return {
      rating: data.rating,
      reviewCount: data.user_ratings_total,
      photos: data.photos?.map((photo: any) => photo.photo_reference),
      openingHours: data.opening_hours,
      website: data.website,
      phoneNumber: data.formatted_phone_number,
      address: data.formatted_address,
      reviews: data.reviews?.slice(0, 5), // Keep only recent reviews
    };
  }

  private static extractGooglePlacesData(data: Record<string, any>): Record<string, any> {
    return {
      placeId: data.place_id,
      rating: data.rating,
      reviewCount: data.user_ratings_total,
      photos: data.photos?.map((photo: any) => ({
        reference: photo.photo_reference,
        width: photo.width,
        height: photo.height,
      })),
      geometry: data.geometry,
      types: data.types,
      vicinity: data.vicinity,
    };
  }

  static generateJobId(): string {
    return `scrape_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static calculateSuccessRate(results: Array<{ status: ScrapingStatus }>): number {
    if (results.length === 0) return 0;
    
    const successful = results.filter(r => r.status === ScrapingStatus.SUCCESS).length;
    return Math.round((successful / results.length) * 100);
  }

  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max)
    const baseDelay = 1000;
    const maxDelay = 16000;
    const delay = baseDelay * Math.pow(2, attempt - 1);
    return Math.min(delay, maxDelay);
  }

  static canRetry(attempt: number, maxAttempts: number = 3): boolean {
    return attempt < maxAttempts;
  }

  static isRateLimited(errorMessage: string): boolean {
    const rateLimitKeywords = [
      'rate limit',
      'too many requests',
      'quota exceeded',
      '429',
      'throttled',
    ];
    
    return rateLimitKeywords.some(keyword => 
      errorMessage.toLowerCase().includes(keyword)
    );
  }

  static getDataAge(scrapedAt: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - scrapedAt.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
    if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    }
    return 'Less than 1 hour ago';
  }
}