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
  seo?: { title: string; description: string; context: string };
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
    seo: {
      title: "Baixar vídeo do YouTube e Shorts online — i-Tools",
      description: "Baixe vídeos e Shorts públicos do YouTube que sejam seus ou autorizados. Escolha a qualidade disponível, sem cadastro e sem instalar programas.",
      context: "Vídeos e Shorts podem ter diferentes qualidades disponíveis. O download depende de acesso público, autorização e disponibilidade do serviço; conteúdos privados, pagos ou protegidos não são aceitos.",
    },
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
    seo: {
      title: "Baixar vídeo do TikTok sem marca d'água — i-Tools",
      description: "Baixe vídeos públicos do TikTok seus ou autorizados, sem marca d'água quando disponível. Download online gratuito, sem cadastro ou instalação.",
      context: "O arquivo sem marca d'água depende da versão disponibilizada pelo serviço de download. Apenas conteúdos públicos seus ou autorizados podem ser baixados; a ferramenta não acessa contas privadas.",
    },
    name: "Baixar vídeo do TikTok sem marca d'água",
    summary: "Baixe vídeos públicos do TikTok sem marca d'água que sejam seus ou autorizados.",
    category: "produtividade",
    icon: Video,
    status: "live",
    featured: true,
    keywords: ["tiktok", "baixar", "vídeo", "download", "sem marca d'água", "watermark"],
  },
  {
    slug: "baixar-video-instagram",
    seo: {
      title: "Baixar vídeo do Instagram e Reels online — i-Tools",
      description: "Baixe Reels e vídeos públicos do Instagram que sejam seus ou autorizados. Download gratuito pelo navegador, sem cadastro e sem instalar aplicativos.",
      context: "Reels e vídeos públicos podem ser salvos quando o serviço consegue obter o arquivo. Perfis privados, conteúdos que exigem login e materiais protegidos não são acessados pelo i-Tools.",
    },
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
    seo: {
      title: "Gerador de QR Code grátis: link para PNG e SVG — i-Tools",
      description: "Crie QR Code de um link e baixe em PNG ou SVG para impressão e uso digital. Gerador gratuito no navegador, sem cadastro e sem enviar sua URL.",
      context: "Um QR Code estático guarda o endereço informado, sem depender de assinatura. PNG atende ao uso digital; SVG preserva a nitidez na impressão. O código não expira, mas o site de destino precisa continuar acessível.",
    },
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
    seo: {
      title: "Comprimir imagem JPG, PNG e WebP online grátis — i-Tools",
      description: "Reduza o tamanho de imagens JPG, PNG e WebP com controle de qualidade. Comprima e baixe no navegador, gratuitamente, sem enviar seus arquivos.",
      context: "O tamanho final depende do formato, da qualidade escolhida e do arquivo original. A compressão com perdas pode alterar detalhes da imagem; o processamento é local e mantém seu arquivo original intacto.",
    },
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
    seo: {
      title: "Converter imagens e TXT em PDF ou PDF em PNG — i-Tools",
      description: "Converta JPG, PNG, WebP e TXT em PDF ou exporte páginas de PDF para PNG. Conversão gratuita no navegador, sem cadastro e sem enviar arquivos.",
      context: "A conversão reúne imagens e textos em um documento PDF ou transforma páginas de PDF em PNG. PDFs com várias páginas geram um ZIP. Não inclui conversão para Word, OCR ou acesso a documentos protegidos por senha.",
    },
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
    seo: {
      title: "Gerador de senhas fortes e aleatórias grátis — i-Tools",
      description: "Gere senhas de 8 a 128 caracteres com letras, números e símbolos. Aleatoriedade criptográfica no navegador, sem cadastro e sem armazenar senhas.",
      context: "Senhas longas e únicas reduzem o risco de reutilização entre contas. A geração usa a aleatoriedade criptográfica do navegador. O i-Tools não guarda as senhas nem oferece recuperação de uma senha gerada.",
    },
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
    seo: {
      title: "Contador de palavras e caracteres online grátis — i-Tools",
      description: "Conte palavras e caracteres e veja uma estimativa de tempo de leitura. Contador gratuito no navegador, sem cadastro e sem enviar seu texto.",
      context: "A contagem facilita a revisão de textos com limites de extensão. O tempo de leitura é uma estimativa, não uma medição individual. O texto permanece no navegador durante o processamento.",
    },
    name: "Contador de palavras",
    summary: "Palavras, caracteres e tempo de leitura de qualquer texto.",
    category: "texto",
    icon: Hash,
    status: "live",
    keywords: ["palavras", "caracteres", "contar"],
  },
  {
    slug: "json",
    seo: {
      title: "Formatador e validador JSON online grátis — i-Tools",
      description: "Valide a sintaxe e formate JSON para facilitar a leitura, ou compacte o resultado. Ferramenta gratuita no navegador, sem enviar seus dados.",
      context: "JSON é um formato de troca de dados com regras próprias de sintaxe. A validação identifica problemas de estrutura, mas não verifica regras de negócio ou conformidade com um JSON Schema. Os dados são processados localmente.",
    },
    name: "Formatador JSON",
    summary: "Valide e formate JSON com legibilidade.",
    category: "desenvolvedores",
    icon: Braces,
    status: "live",
    keywords: ["json", "formatar", "validar"],
  },
  {
    slug: "meu-ip",
    seo: {
      title: "Qual é meu IP? Consulte seu IP público online — i-Tools",
      description: "Descubra o endereço IP público da sua conexão no navegador. Consulta gratuita, sem cadastro, com explicações sobre IP público, rede e VPN.",
      context: "O IP público identifica a saída da conexão para a internet, não o endereço local de cada aparelho. Uma VPN, proxy ou rede compartilhada pode alterar o IP exibido. A consulta depende de um serviço externo.",
    },
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
    seo: {
      title: "Buscar CEP por endereço ou localização — i-Tools",
      description: "Consulte um CEP, busque o código postal por endereço brasileiro ou encontre uma estimativa pela localização. Consulta gratuita, sem cadastro.",
      context: "O CEP organiza a entrega postal no Brasil. Consultas por código ou endereço usam serviços públicos de endereçamento; a busca por localização depende da permissão do aparelho e pode retornar uma estimativa.",
    },
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
    seo: {
      title: "Redimensionar imagem JPG, PNG e WebP online — i-Tools",
      description: "Altere largura e altura de imagens em pixels, mantendo a proporção quando desejar. Redimensionador gratuito, sem cadastro e sem enviar arquivos.",
      context: "As dimensões em pixels definem a largura e a altura da imagem. Preservar a proporção evita distorções. Aumentar as dimensões não recupera detalhes ausentes no original; o processamento acontece no navegador.",
    },
    name: "Redimensionador de imagens",
    summary: "Ajuste largura e altura para redes sociais e sites.",
    category: "imagens",
    icon: Maximize2,
    status: "live",
    keywords: ["redimensionar", "tamanho", "imagem"],
  },
  {
    slug: "porcentagem",
    seo: {
      title: "Calculadora de porcentagem, desconto e aumento — i-Tools",
      description: "Calcule porcentagem de um valor, preço com desconto, aumento e variação percentual. Calculadora gratuita no navegador, sem cadastro.",
      context: "Porcentagem expressa uma proporção em cada cem unidades. Desconto e aumento usam uma taxa aplicada ao valor; variação percentual compara dois valores. A variação não pode ser calculada a partir de um valor inicial zero.",
    },
    name: "Calculadora de porcentagem",
    summary: "Descontos, aumentos e variações em segundos.",
    category: "calculadoras",
    icon: Percent,
    status: "live",
    keywords: ["porcentagem", "desconto", "calcular"],
  },
  {
    slug: "paleta-de-cores",
    seo: {
      title: "Gerador de paleta de cores HEX e RGB grátis — i-Tools",
      description: "Crie combinações de cores, copie códigos HEX e RGB e salve sua paleta. Gerador gratuito para projetos visuais, sem cadastro e no navegador.",
      context: "HEX e RGB representam cores usadas em interfaces digitais. Uma paleta organiza combinações para um projeto, mas não garante contraste acessível em todas as aplicações. A leitura depende das cores de texto e fundo usadas juntas.",
    },
    name: "Gerador de paletas",
    summary: "Combinações de cores com códigos HEX e RGB.",
    category: "imagens",
    icon: Palette,
    status: "live",
    keywords: ["cores", "paleta", "hex"],
  },
  {
    slug: "cronometro",
    seo: {
      title: "Cronômetro online, timer e Pomodoro grátis — i-Tools",
      description: "Marque o tempo com cronômetro, contagem regressiva e Pomodoro no navegador. Timer gratuito, sem cadastro e sem instalar aplicativos.",
      context: "O cronômetro mede tempo decorrido; o timer trabalha com uma duração definida. Pomodoro alterna períodos de foco e pausa. Alertas dependem do navegador e das permissões de áudio do aparelho.",
    },
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
