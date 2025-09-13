import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.list', () => {
  it('should list properties with filters', async () => {
    const result = await trpc.properties.list.query({
      propertyType: ['LODGE'],
      priceRange: ['LUXURY'],
      province: 'MPUMALANGA'
    });

    expect(result.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          propertyType: 'LODGE'
        })
      ])
    );
  });
});