import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reviews.getUserReviews', () => {
  it('should get current user reviews', async () => {
    const result = await trpc.reviews.getUserReviews.query();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rating: expect.any(Number),
          moderationStatus: expect.any(String)
        })
      ])
    );
  });
});