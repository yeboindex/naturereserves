import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: admin.getReserves', () => {
  it('should get reserves for governing body', async () => {
    const result = await trpc.admin.getReserves.query();

    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          verificationStatus: expect.any(String),
          pendingReviews: expect.any(Number)
        })
      ])
    );
  });
});