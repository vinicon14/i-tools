/**
 * Registro único de ferramentas do i-Tools.
 * Nova ferramenta = adicionar entrada aqui.
 */

export type ToolStatus = 'disponivel' | 'em-breve';

export type CategorySlug = 
  | 'arquivos'
  | 'imagens'
  | 'texto'
  | 'calculadoras'
  | 'produtividade'
  | 'desenvolvedores';

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  icon: string;
};

export type Tool = {
  slug: string;
  path: string;
  name: string;
  short: string;
  category: CategorySlug;
  icon: string;
  status: ToolStatus;
  featured?: boolean;
  seo: {
    title: string;
    description: string;
  };
  updated: string;
};

export const categories: Category[] = [
  {
    slug: 'arquivos',
    name: 'Arquivos e documentos',
    description: 'Converter, juntar e reduzir PDFs.',
    icon: 'file-text',
  },
  {
    slug: 'imagens',
    name: 'Imagens e design',
    description: 'Comprimir, redimensionar e converter imagens.',
    icon: 'image',
  },
  {
    slug: 'texto',
    name: 'Texto e escrita',
    description: 'Contar, formatar e limpar textos.',
    icon: 'type',
  },
  {
    slug: 'calculadoras',
    name: 'Calculadoras',
    description: 'Porcentagem, juros, datas e medidas.',
    icon: 'calculator',
  },
  {
    slug: 'produtividade',
    name: 'Produtividade',
    description: 'Senhas, QR Codes e pequenos atalhos do dia.',
    icon: 'list-checks',
  },
  {
    slug: 'desenvolvedores',
    name: 'Desenvolvedores',
    description: 'JSON, Base64, cores e codificação.',
    icon: 'code-2',
  },
];

export const tools: Tool[] = [
  {
    slug: 'qr',
    path: '/qr',
    name: 'Gerador de QR Code',
    short: 'Transforme links, textos e Wi‑Fi em QR Code para imprimir.',
    category: 'produtividade',
    icon: 'qr-code',
    status: 'em-breve',
    featured: true,
    seo: {
      title: 'Gerador de QR Code grátis | i-Tools',
      description: 'Crie QR Codes de links, textos e Wi‑Fi direto no navegador, sem cadastro.',
    },
    updated: '2026-11-01',
  },
  {
    slug: 'comprimir-imagem',
    path: '/imagens/comprimir',
    name: 'Compressor de imagens',
    short: 'Comprima JPG, PNG e WebP mantendo a qualidade.',
    category: 'imagens',
    icon: 'image-down',
    status: 'em-breve',
    featured: true,
    seo: {
      title: 'Comprimir imagem online grátis | i-Tools',
      description: 'Reduza o tamanho de JPG, PNG e WebP sem perder qualidade.',
    },
    updated: '2026-11-01',
  },
  {
    slug: 'pdf',
    path: '/pdf',
    name: 'Conversor de PDF',
    short: 'Converta imagens e documentos para PDF.',
    category: 'arquivos',
    icon: 'file-type-2',
    status: 'em-breve',
    featured: true,
    seo: {
      title: 'Conversor de PDF online grátis | i-Tools',
      description: 'Converta imagens e TXT em PDF direto no navegador.',
    },
    updated: '2026-11-01',
  },
  {
    slug: 'senhas',
    path: '/senhas',
    name: 'Gerador de senhas',
    short: 'Senhas fortes e aleatórias, geradas no seu dispositivo.',
    category: 'produtividade',
    icon: 'key-round',
    status: 'em-breve',
    featured: true,
    seo: {
      title: 'Gerador de senhas seguras | i-Tools',
      description: 'Crie senhas fortes e aleatórias direto no navegador.',
    },
    updated: '2026-11-01',
  },
  {
    slug: 'contador-palavras',
    path: '/texto/contador',
    name: 'Contador de palavras',
    short: 'Conte palavras, caracteres e tempo de leitura.',
    category: 'texto',
    icon: 'hash',
    status: 'em-breve',
    seo: {
      title: 'Contador de palavras e caracteres | i-Tools',
      description: 'Conte palavras, caracteres e calcule tempo de leitura.',
    },
    updated: '2026-11-01',
  },
  {
    slug: 'json',
    path: '/json',
    name: 'Formatador JSON',
    short: 'Valide e formate JSON com legibilidade.',
    category: 'desenvolvedores',
    icon: 'braces',
    status: 'em-breve',
    seo: {
      title: 'Formatador e validador JSON | i-Tools',
      description: 'Formate e valide JSON online, grátis.',
    },
    updated: '2026-11-01',
  },
];

export const getCategory = (slug: CategorySlug) => 
  categories.find(c => c.slug === slug);

export const getToolsByCategory = (slug: CategorySlug) => 
  tools.filter(t => t.category === slug);

export const getFeaturedTools = () => 
  tools.filter(t => t.featured);

export const getAvailableTools = () => 
  tools.filter(t => t.status === 'disponivel');

export const countToolsByStatus = (status: ToolStatus) => 
  tools.filter(t => t.status === status).length;
