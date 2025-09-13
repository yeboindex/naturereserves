import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reviews.create', () => {
  it('should create a new review', async () => {
    const result = await trpc.reviews.create.mutate({
      reserveId: 'kruger-123',
      rating: 5,
      title: 'Amazing experience',
      content: 'Saw all the Big Five!',
      visitDate: '2024-07-15'
    });

    expect(result.id).toBeDefined();
    expect(result.status).toBe('pending');
  });
});