import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: reserves.verify', () => {
  it('should verify reserve information', async () => {
    const result = await trpc.reserves.verify.mutate({
      id: 'reserve-123',
      verificationStatus: 'VERIFIED',
      notes: 'All information confirmed'
    });

    expect(result.id).toBe('reserve-123');
    expect(result.verificationStatus).toBe('VERIFIED');
  });
});