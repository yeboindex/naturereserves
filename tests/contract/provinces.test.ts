import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: provinces.list', () => {
  it('should list SA provinces', async () => {
    const result = await trpc.provinces.list.query();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'WESTERN_CAPE',
          name: 'Western Cape'
        })
      ])
    );
  });
});