import { z } from 'zod';
import { ModerationStatus, AISentiment } from '@prisma/client';

export const ReviewCreateSchema = z.object({
  authorId: z.string(),
  reserveId: z.string().optional(),
  propertyId: z.string().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().max(100).optional(),
  content: z.string().min(10).max(2000).optional(),
  visitDate: z.date().max(new Date(), 'Visit date cannot be in the future'),
})
.refine(
  (data) => data.reserveId || data.propertyId,
  { message: 'Either reserveId or propertyId must be provided' }
)
.refine(
  (data) => !(data.reserveId && data.propertyId),
  { message: 'Cannot provide both reserveId and propertyId' }
);

export const ReviewUpdateSchema = ReviewCreateSchema.partial().extend({
  id: z.string(),
});

export const ReviewModerationSchema = z.object({
  id: z.string(),
  moderationStatus: z.nativeEnum(ModerationStatus),
  reason: z.string().optional(),
});

export const ReviewSearchSchema = z.object({
  reserveId: z.string().optional(),
  propertyId: z.string().optional(),
  authorId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  moderationStatus: z.nativeEnum(ModerationStatus).optional(),
  sort: z.enum(['createdAt', 'rating', 'helpfulCount']).default('createdAt'),
  order: z.enum(['asc', 'desc']).default('desc'),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(10),
});

export type ReviewCreate = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdate = z.infer<typeof ReviewUpdateSchema>;
export type ReviewModeration = z.infer<typeof ReviewModerationSchema>;
export type ReviewSearch = z.infer<typeof ReviewSearchSchema>;

export class ReviewModel {
  static validateCreate(data: unknown) {
    return ReviewCreateSchema.parse(data);
  }

  static validateUpdate(data: unknown) {
    return ReviewUpdateSchema.parse(data);
  }

  static validateModeration(data: unknown) {
    return ReviewModerationSchema.parse(data);
  }

  static validateSearch(data: unknown) {
    return ReviewSearchSchema.parse(data);
  }

  static canUserEditReview(review: { authorId: string }, userId: string): boolean {
    return review.authorId === userId;
  }

  static canUserModerateReview(userType: string): boolean {
    return userType === 'ADMIN';
  }

  static isReviewRecent(createdAt: Date): boolean {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    return createdAt > oneDayAgo;
  }

  static calculateSentimentScore(sentiment: AISentiment | null): number {
    const scores = {
      [AISentiment.POSITIVE]: 1,
      [AISentiment.NEUTRAL]: 0,
      [AISentiment.NEGATIVE]: -1,
      [AISentiment.MIXED]: 0.5,
    };
    return sentiment ? scores[sentiment] : 0;
  }

  static shouldAutoApprove(review: {
    rating: number;
    content: string | null;
    authorId: string;
  }): boolean {
    // Auto-approve high ratings with short content from verified users
    if (review.rating >= 4 && (!review.content || review.content.length < 200)) {
      return true;
    }
    return false;
  }

  static detectSpam(content: string): boolean {
    const spamPatterns = [
      /(.)\1{4,}/i, // Repeated characters
      /https?:\/\/[^\s]+/gi, // URLs
      /\b(buy now|click here|limited time|act fast)\b/gi, // Spam phrases
      /[A-Z]{5,}/g, // Excessive caps
    ];

    return spamPatterns.some(pattern => pattern.test(content));
  }

  static generateSummary(content: string): string {
    if (content.length <= 100) return content;
    
    const sentences = content.split(/[.!?]+/);
    const firstSentence = sentences[0]?.trim();
    
    if (firstSentence && firstSentence.length > 20) {
      return firstSentence + (firstSentence.endsWith('.') ? '' : '...');
    }
    
    return content.substring(0, 97) + '...';
  }

  static getModeratorActions(status: ModerationStatus): string[] {
    switch (status) {
      case ModerationStatus.PENDING:
        return ['approve', 'reject'];
      case ModerationStatus.APPROVED:
        return ['remove', 'flag'];
      case ModerationStatus.REJECTED:
        return ['approve'];
      case ModerationStatus.REMOVED:
        return ['approve'];
      default:
        return [];
    }
  }
}