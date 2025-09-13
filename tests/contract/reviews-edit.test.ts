import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reviews.update', () => {
  it('should update user own review', async () => {
    const result = await trpc.reviews.update.mutate({
      id: 'review-123',
      rating: 4,
      title: 'Updated review',
      content: 'Still great but updated thoughts'
    });

    expect(result.id).toBe('review-123');
    expect(result.rating).toBe(4);
  });
});