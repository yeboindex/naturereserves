import { describe, it, expect } from '@jest/globals';
import { trpc } from '@/lib/trpc/client';

describe('Contract: admin.triggerScrape', () => {
  it('should trigger scraping job', async () => {
    const result = await trpc.admin.triggerScrape.mutate({
      reserveIds: ['reserve-123'],
      dataSource: 'DATA_FOR_SEO'
    });

    expect(result.jobId).toBeDefined();
    expect(result.status).toBe('queued');
  });
});