import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reviews.delete', () => {
  it('should delete user own review', async () => {
    const result = await trpc.reviews.delete.mutate({
      id: 'review-123'
    });

    expect(result.success).toBe(true);
  });
});