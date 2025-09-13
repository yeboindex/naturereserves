import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reserves.getBySlug', () => {
  it('should get reserve by slug', async () => {
    const result = await trpc.reserves.getBySlug.query({
      slug: 'kruger-national-park'
    });

    expect(result.name).toBe('Kruger National Park');
  });
});