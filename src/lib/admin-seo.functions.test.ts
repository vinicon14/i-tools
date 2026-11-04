import { expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ auth: vi.fn(), generate: vi.fn() }));
vi.mock('./admin-session.server', () => ({ requireAdminSession: mocks.auth }));
vi.mock('@lovable.dev/ai-gateway', () => ({ generateResponse: mocks.generate, GatewayError: class extends Error {} }));
vi.mock('@tanstack/react-start', () => ({ createServerFn: () => ({ inputValidator: (validate: (data: unknown) => unknown) => ({ handler: (handler: (args: { data: unknown }) => unknown) => (args: { data: unknown }) => handler({ data: validate(args.data) }) }) }) }));
import { generateToolSeo } from './admin-seo.functions';

it('blocks AI generation without an authenticated admin session', async () => {
  mocks.auth.mockRejectedValueOnce(new Error('Acesso administrativo não autorizado.'));
  await expect(generateToolSeo({ data: { name: 'QR Code', description: 'Gera QR Code de uma URL.' } })).rejects.toThrow('não autorizado');
  expect(mocks.generate).not.toHaveBeenCalled();
});