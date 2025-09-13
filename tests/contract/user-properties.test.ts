import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.getUserProperties', () => {
  it('should get user property dashboard', async () => {
    const result = await trpc.properties.getUserProperties.query();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          viewCount: expect.any(Number),
          clickCount: expect.any(Number),
          isPremium: expect.any(Boolean)
        })
      ])
    );
  });
});