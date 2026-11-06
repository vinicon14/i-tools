import { describe, it, expect } from 'vitest';
import { seoInputSchema, seoDraftSchema, seoDraftText } from './admin-seo';

const draft = { titles: ['QR Code | i-Tools', 'Gerador QR | i-Tools', 'Criar QR Code | i-Tools'], metaDescriptions: ['Converta sua URL em QR Code.', 'Crie um QR Code para sua URL.', 'Gere um QR Code online.'], heading: 'Gerador de QR Code', introduction: 'Transforme URLs em QR Codes.', sections: [{ heading: 'URLs em QR Code', body: 'Converta uma URL em QR Code.' }, { heading: 'Gratuito', body: 'Sem assinatura.' }] };
describe('admin SEO drafts', () => {
  it('requires the tool name and description', () => {
    expect(seoInputSchema.safeParse({ name: '', description: '' }).success).toBe(false);
    expect(seoInputSchema.parse({ name: 'QR Code', description: 'Gera QR Code a partir de uma URL.' }).name).toBe('QR Code');
  });
  it('validates generated titles and meta description lengths', () => {
    expect(seoDraftSchema.safeParse(draft).success).toBe(true);
    expect(seoDraftSchema.safeParse({ ...draft, titles: ['x'.repeat(66), ...draft.titles.slice(1)] }).success).toBe(false);
    expect(seoDraftSchema.safeParse({ ...draft, metaDescriptions: ['x'.repeat(161), ...draft.metaDescriptions.slice(1)] }).success).toBe(false);
  });
  it('exports all generated alternatives and page sections', () => {
    const text = seoDraftText(seoDraftSchema.parse(draft));
    for (const value of [...draft.titles, ...draft.metaDescriptions, draft.heading, draft.introduction, ...draft.sections.flatMap(s => [s.heading, s.body])]) expect(text).toContain(value);
  });
});