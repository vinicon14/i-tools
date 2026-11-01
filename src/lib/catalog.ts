import {
  Braces, Calculator, FileText, FileType2, Image, ImageDown, KeyRound, ListChecks,
  Maximize2, Percent, QrCode, Type, Code2, Timer, Palette, Hash,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for the i-Tools catalog.
 * Adding a tool = adding an entry here. Its page lives at /<slug>.
 * When a tool goes live, set status "live" and give it its own route file
 * (src/routes/<slug>.tsx), which takes priority over the dynamic /$tool page.
 */
export type ToolStatus = "planned" | "live";

export type Category = {
  slug: string;
  name: string;
  description: string;
  icon: LucideIcon;
};

export type Tool = {
  slug: string;
  name: string;
  summary: string;
  category: Category["slug"];
  icon: LucideIcon;
  status: ToolStatus;
  featured?: boolean;
  keywords: string[];
};

export const SITE = {
  name: "i-Tools",
  tagline: "Ferramentas inteligentes para simplificar seu dia.",
  description:
    "Ferramentas online gratuitas para arquivos, imagens, texto, cálculos e desenvolvimento. Direto no navegador, sem cadastro e sem instalação.",
};

export const categories: Category[] = [
  { slug: "arquivos", name: "Arquivos e documentos", description: "Converter, juntar e organizar PDFs e outros arquivos.", icon: FileText },
  { slug: "imagens", name: "Imagens e design", description: "Comprimir, redimensionar e converter imagens.", icon: Image },
  { slug: "texto", name: "Texto e escrita", description: "Contar, formatar e transformar textos.", icon: Type },
  { slug: "calculadoras", name: "Calculadoras", description: "Porcentagens, datas, finanças e unidades.", icon: Calculator },
  { slug: "produtividade", name: "Produtividade", description: "QR Codes, listas e utilitários do dia a dia.", icon: ListChecks },
  { slug: "desenvolvedores", name: "Desenvolvedores", description: "Formatadores, geradores e conversores técnicos.", icon: Code2 },
];

export const tools: Tool[] = [
  { slug: "qr", name: "Gerador de QR Code", summary: "Crie QR Codes para links, Wi-Fi e contatos.", category: "produtividade", icon: QrCode, status: "planned", featured: true, keywords: ["qr", "código", "link", "wifi"] },
  { slug: "comprimir-imagem", name: "Compressor de imagens", summary: "Reduza o peso de JPG, PNG e WebP sem perder qualidade visível.", category: "imagens", icon: ImageDown, status: "planned", featured: true, keywords: ["comprimir", "jpg", "png", "webp", "otimizar"] },
  { slug: "pdf", name: "Conversor de PDF", summary: "Converta documentos de e para PDF.", category: "arquivos", icon: FileType2, status: "planned", featured: true, keywords: ["pdf", "word", "converter", "documento"] },
  { slug: "senhas", name: "Gerador de senhas", summary: "Senhas fortes e aleatórias, geradas no seu dispositivo.", category: "desenvolvedores", icon: KeyRound, status: "planned", featured: true, keywords: ["senha", "segurança", "aleatória"] },
  { slug: "contador-de-palavras", name: "Contador de palavras", summary: "Palavras, caracteres e tempo de leitura de qualquer texto.", category: "texto", icon: Hash, status: "planned", featured: true, keywords: ["palavras", "caracteres", "contar"] },
  { slug: "json", name: "Formatador JSON", summary: "Valide e formate JSON com legibilidade.", category: "desenvolvedores", icon: Braces, status: "planned", featured: true, keywords: ["json", "formatar", "validar"] },
  { slug: "redimensionar-imagem", name: "Redimensionador de imagens", summary: "Ajuste largura e altura para redes sociais e sites.", category: "imagens", icon: Maximize2, status: "planned", keywords: ["redimensionar", "tamanho", "imagem"] },
  { slug: "porcentagem", name: "Calculadora de porcentagem", summary: "Descontos, aumentos e variações em segundos.", category: "calculadoras", icon: Percent, status: "planned", keywords: ["porcentagem", "desconto", "calcular"] },
  { slug: "paleta-de-cores", name: "Gerador de paletas", summary: "Combinações de cores com códigos HEX e RGB.", category: "imagens", icon: Palette, status: "planned", keywords: ["cores", "paleta", "hex"] },
  { slug: "cronometro", name: "Cronômetro e timer", summary: "Contagem regressiva e pomodoro no navegador.", category: "produtividade", icon: Timer, status: "planned", keywords: ["timer", "pomodoro", "tempo"] },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const toolsByCategory = (slug: string) => tools.filter((t) => t.category === slug);
export const featuredTools = () => tools.filter((t) => t.featured);

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function searchTools(query: string): Tool[] {
  const q = norm(query.trim());
  if (!q) return [];
  return tools.filter((t) =>
    norm([t.name, t.summary, getCategory(t.category)?.name ?? "", ...t.keywords].join(" ")).includes(q),
  );
}

export const statusLabel = (s: ToolStatus) => (s === "live" ? "Disponível" : "Em breve");
