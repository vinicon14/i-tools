export type Category = { id: string; name: string; description: string };

export type PlannedTool = {
  slug: string;
  name: string;
  summary: string;
  category: string;
};

export const categories: Category[] = [
  { id: "texto", name: "Texto e escrita", description: "Resumir, revisar e reescrever textos." },
  { id: "imagem", name: "Imagem", description: "Descrever, legendar e organizar imagens." },
  { id: "estudos", name: "Estudos", description: "Apoio para aprender e revisar conteúdos." },
  { id: "trabalho", name: "Trabalho", description: "Agilizar e-mails, reuniões e rotinas." },
];

export const plannedTools: PlannedTool[] = [
  { slug: "resumidor-de-texto", name: "Resumidor de texto", summary: "Transformar textos longos em resumos claros.", category: "texto" },
  { slug: "revisor-gramatical", name: "Revisor gramatical", summary: "Sugestões de ortografia e gramática em português.", category: "texto" },
  { slug: "gerador-de-legendas", name: "Gerador de legendas", summary: "Ideias de legendas para fotos e posts.", category: "imagem" },
  { slug: "texto-alternativo", name: "Texto alternativo", summary: "Descrições acessíveis para imagens (alt text).", category: "imagem" },
  { slug: "criador-de-flashcards", name: "Criador de flashcards", summary: "Cartões de revisão a partir das suas anotações.", category: "estudos" },
  { slug: "explicador-de-conceitos", name: "Explicador de conceitos", summary: "Explicações simples para temas difíceis.", category: "estudos" },
  { slug: "assistente-de-email", name: "Assistente de e-mail", summary: "Rascunhos de e-mails profissionais.", category: "trabalho" },
  { slug: "ata-de-reuniao", name: "Ata de reunião", summary: "Organizar anotações em atas objetivas.", category: "trabalho" },
];

export const getTool = (slug: string) => plannedTools.find((t) => t.slug === slug);
export const getCategory = (id: string) => categories.find((c) => c.id === id);

export function searchPlanned(query: string): PlannedTool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return plannedTools.filter((t) =>
    [t.name, t.summary, getCategory(t.category)?.name ?? ""].join(" ").toLowerCase().includes(q),
  );
}
