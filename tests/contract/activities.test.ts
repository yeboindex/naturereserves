import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: activities.list', () => {
  it('should list all activities', async () => {
    const result = await trpc.activities.list.query();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Game Drives',
          category: 'WILDLIFE_VIEWING'
        })
      ])
    );
  });
});