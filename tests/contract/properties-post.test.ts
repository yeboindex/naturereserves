import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.create', () => {
  it('should create new property listing', async () => {
    const result = await trpc.properties.create.mutate({
      name: 'New Safari Lodge',
      description: 'Beautiful lodge near Kruger',
      propertyType: 'LODGE',
      location: { lat: -24.5, lng: 31.2 },
      address: 'Safari Road, Mpumalanga',
      contactEmail: 'contact@safariage.com',
      contactPhone: '+27 11 123 4567',
      priceRange: 'LUXURY',
      capacityGuests: 20,
      capacityUnits: 10
    });

    expect(result.id).toBeDefined();
    expect(result.name).toBe('New Safari Lodge');
  });
});