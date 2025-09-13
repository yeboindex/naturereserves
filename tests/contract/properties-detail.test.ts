import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.getBySlug', () => {
  it('should get property by slug', async () => {
    const result = await trpc.properties.getBySlug.query({
      slug: 'sabi-sabi-lodge'
    });

    expect(result.name).toBe('Sabi Sabi Private Game Reserve');
    expect(result.propertyType).toBe('LODGE');
  });
});