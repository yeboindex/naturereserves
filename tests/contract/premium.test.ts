import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: properties.upgradeToPremium', () => {
  it('should upgrade property to premium', async () => {
    const result = await trpc.properties.upgradeToPremium.mutate({
      id: 'prop-123',
      duration: 6,
      paymentMethod: 'credit_card'
    });

    expect(result.success).toBe(true);
    expect(result.expiresAt).toBeDefined();
  });
});