import { z } from 'zod';

export const seoInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(10).max(4000),
});
export const seoDraftSchema = z.object({
  titles: z.array(z.string().trim().min(1).max(65)).length(3),
  metaDescriptions: z.array(z.string().trim().min(1).max(160)).length(3),
  heading: z.string().trim().min(1).max(120),
  introduction: z.string().trim().min(1).max(1000),
  sections: z.array(z.object({ heading: z.string().trim().min(1).max(120), body: z.string().trim().min(1).max(2000) })).min(2).max(4),
});
export type SeoDraft = z.infer<typeof seoDraftSchema>;

export function seoDraftText(draft: SeoDraft) {
  return `TÍTULOS SEO\n${draft.titles.join('\n')}\n\nMETA DESCRIÇÕES\n${draft.metaDescriptions.join('\n')}\n\n# ${draft.heading}\n\n${draft.introduction}\n\n${draft.sections.map(s => `## ${s.heading}\n\n${s.body}`).join('\n\n')}`;
}