import { describe, expect, it } from 'vitest';
import { matchesAdminCredentials } from './admin-credentials';

describe('admin credentials', () => {
  it('allows only the configured username vinicon14 with its matching password', async () => {
    expect(await matchesAdminCredentials('vinicon14', 'test-only-password', 'vinicon14', 'test-only-password')).toBe(true);
    expect(await matchesAdminCredentials('another-user', 'test-only-password', 'vinicon14', 'test-only-password')).toBe(false);
    expect(await matchesAdminCredentials('vinicon14', 'incorrect', 'vinicon14', 'test-only-password')).toBe(false);
  });
  it('fails closed without configuration', async () => {
    expect(await matchesAdminCredentials('', '', '', '')).toBe(false);
  });
});