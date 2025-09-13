import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.update', () => {
  it('should update property listing', async () => {
    const result = await trpc.properties.update.mutate({
      id: 'prop-123',
      name: 'Updated Lodge Name',
      priceRange: 'ULTRA_LUXURY',
      capacityGuests: 25
    });

    expect(result.id).toBe('prop-123');
    expect(result.name).toBe('Updated Lodge Name');
  });
});