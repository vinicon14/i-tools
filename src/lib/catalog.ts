import {
  Braces,
  Calculator,
  FileText,
  FileType2,
  Image,
  ImageDown,
  KeyRound,
  ListChecks,
  Maximize2,
  Percent,
  Wifi,
  MapPin,
  QrCode,
  Type,
  Code2,
  Timer,
  Palette,
  Hash,
  Youtube,
  Video,
  Instagram,
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
  {
    slug: "arquivos",
    name: "Arquivos e documentos",
    description: "Converter, juntar e organizar PDFs e outros arquivos.",
    icon: FileText,
  },
  {
    slug: "imagens",
    name: "Imagens e design",
    description: "Comprimir, redimensionar e converter imagens.",
    icon: Image,
  },
  {
    slug: "texto",
    name: "Texto e escrita",
    description: "Contar, formatar e transformar textos.",
    icon: Type,
  },
  {
    slug: "calculadoras",
    name: "Calculadoras",
    description: "Porcentagens, datas, finanças e unidades.",
    icon: Calculator,
  },
  {
    slug: "produtividade",
    name: "Produtividade",
    description: "QR Codes, listas e utilitários do dia a dia.",
    icon: ListChecks,
  },
  {
    slug: "desenvolvedores",
    name: "Desenvolvedores",
    description: "Formatadores, geradores e conversores técnicos.",
    icon: Code2,
  },
];

export const tools: Tool[] = [
  {
    slug: "baixar-video-youtube",
    name: "Baixar vídeo do YouTube",
    summary: "Baixe vídeos e Shorts públicos autorizados, com escolha de qualidade.",
    category: "produtividade",
    icon: Youtube,
    status: "live",
    featured: true,
    keywords: ["youtube", "baixar", "vídeo", "download", "shorts"],
  },
  {
    slug: "baixar-video-tiktok",
    name: "Baixar vídeo do TikTok",
    summary: "Baixe vídeos públicos do TikTok que sejam seus ou autorizados.",
    category: "produtividade",
    icon: Video,
    status: "live",
    featured: true,
    keywords: ["tiktok", "baixar", "vídeo", "download"],
  },
  {
    slug: "baixar-video-instagram",
    name: "Baixar vídeo do Instagram",
    summary: "Baixe Reels e vídeos públicos seus ou com autorização.",
    category: "produtividade",
    icon: Instagram,
    status: "live",
    featured: true,
    keywords: ["instagram", "baixar", "vídeo", "download", "reels"],
  },
  {
    slug: "qr",
    name: "Gerador de QR Code",
    summary: "Transforme qualquer URL em um QR Code pronto para baixar.",
    category: "produtividade",
    icon: QrCode,
    status: "live",
    featured: true,
    keywords: ["qr", "código", "link", "wifi"],
  },
  {
    slug: "comprimir-imagem",
    name: "Compressor de imagens",
    summary: "Comprima JPG, PNG e WebP com controle de qualidade.",
    category: "imagens",
    icon: ImageDown,
    status: "live",
    featured: true,
    keywords: ["comprimir", "jpg", "png", "webp", "otimizar"],
  },
  {
    slug: "pdf",
    name: "Conversor de PDF",
    summary: "Converta imagens e TXT em PDF ou PDF em imagens PNG.",
    category: "arquivos",
    icon: FileType2,
    status: "live",
    featured: true,
    keywords: ["pdf", "txt", "png", "converter", "documento"],
  },
  {
    slug: "senhas",
    name: "Gerador de senhas",
    summary: "Senhas fortes e aleatórias, geradas no seu dispositivo.",
    category: "desenvolvedores",
    icon: KeyRound,
    status: "live",
    featured: true,
    keywords: ["senha", "segurança", "aleatória"],
  },
  {
    slug: "contador-de-palavras",
    name: "Contador de palavras",
    summary: "Palavras, caracteres e tempo de leitura de qualquer texto.",
    category: "texto",
    icon: Hash,
    status: "live",
    keywords: ["palavras", "caracteres", "contar"],
  },
  {
    slug: "json",
    name: "Formatador JSON",
    summary: "Valide e formate JSON com legibilidade.",
    category: "desenvolvedores",
    icon: Braces,
    status: "live",
    keywords: ["json", "formatar", "validar"],
  },
  {
    slug: "meu-ip",
    name: "Qual é meu IP",
    summary: "Veja o endereço IP público da sua conexão.",
    category: "produtividade",
    icon: Wifi,
    status: "live",
    featured: true,
    keywords: ["ip", "internet", "rede", "conexão"],
  },
  {
    slug: "meu-cep",
    name: "Meu CEP pela localização",
    summary: "Descubra o CEP de onde você está usando a localização do aparelho.",
    category: "produtividade",
    icon: MapPin,
    status: "live",
    featured: true,
    keywords: ["cep", "endereço", "localização", "gps"],
  },
  {
    slug: "redimensionar-imagem",
    name: "Redimensionador de imagens",
    summary: "Ajuste largura e altura para redes sociais e sites.",
    category: "imagens",
    icon: Maximize2,
    status: "live",
    keywords: ["redimensionar", "tamanho", "imagem"],
  },
  {
    slug: "porcentagem",
    name: "Calculadora de porcentagem",
    summary: "Descontos, aumentos e variações em segundos.",
    category: "calculadoras",
    icon: Percent,
    status: "live",
    keywords: ["porcentagem", "desconto", "calcular"],
  },
  {
    slug: "paleta-de-cores",
    name: "Gerador de paletas",
    summary: "Combinações de cores com códigos HEX e RGB.",
    category: "imagens",
    icon: Palette,
    status: "live",
    keywords: ["cores", "paleta", "hex"],
  },
  {
    slug: "cronometro",
    name: "Cronômetro e timer",
    summary: "Contagem regressiva e pomodoro no navegador.",
    category: "produtividade",
    icon: Timer,
    status: "live",
    keywords: ["timer", "pomodoro", "tempo"],
  },
];

export const getTool = (slug: string) => tools.find((t) => t.slug === slug);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const toolsByCategory = (slug: string) => tools.filter((t) => t.category === slug);
export const featuredTools = () => tools.filter((t) => t.featured);

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export function searchTools(query: string): Tool[] {
  const q = norm(query.trim());
  if (!q) return [];
  return tools.filter((t) =>
    norm(
      [t.name, t.summary, getCategory(t.category)?.name ?? "", ...t.keywords].join(" "),
    ).includes(q),
  );
}

export const statusLabel = (s: ToolStatus) => (s === "live" ? "Disponível" : "Em breve");
