# i-Tools — Proposta de direção visual e arquitetura

## Sobre as skills (transparência)

Nenhuma das 5 skills citadas está instalada neste workspace, e não as executo diretamente. Vou aplicar as diretrizes publicadas por elas (design system e hierarquia do UI/UX Pro Max, direção estética própria do Frontend Design, componentização e a11y do Addy Osmani, Core Web Vitals/SEO do Web Quality, estados de interação do Vercel Guidelines) como checklist em cada etapa. Se quiser, elas podem ser ativadas depois em Configurações > Skills.

## Direção visual: "Ferramentaria editorial"

Inspiração conceitual: precisão do Linear, atalhos/paleta de comandos do Raycast, rigor tipográfico da Vercel — sem copiar.

- **Fundo**: papel quente off-white `#F6F4EF`, texto grafite `#16181D`.
- **Acento único**: laranja-sinal `#FF5A1F` (CTAs, foco, detalhes) + verde-oliva discreto `#3D5A40` para status "em breve". Sem gradientes roxo/azul, sem glass.
- **Tipografia**: _Instrument Serif_ (títulos editoriais, itálico pontual) + _Geist_ (interface) + _Geist Mono_ (rótulos, URLs `/qr`, atalhos ⌘K).
- **Forma**: cantos de 6px, bordas finas de 1px, grid visível em réguas finas, ícones Lucide em traço 1.5px.
- **Assinatura**: busca estilo paleta de comandos (atalho `/` ou ⌘K), cada card exibe sua URL futura em mono (`itools.com.br/qr`), índice numerado das categorias (01–06) estilo sumário de revista.
- **Movimento**: apenas transições de 150ms em hover/foco; respeita `prefers-reduced-motion`.

## Estrutura da landing

1. Header fixo: logotipo tipográfico "i-Tools", menu de categorias, botão de busca (⌘K), menu mobile em gaveta.
2. Hero: frase "Ferramentas inteligentes para simplificar seu dia.", busca central, faixa "Grátis · Sem cadastro · No navegador".
3. Ferramentas em destaque: 6 cards (QR Code, Compressor de imagens, PDF, Senhas, Contador de palavras, Formatador JSON) marcados "Em breve", com link para a página da ferramenta.
4. Categorias: índice 01–06 (Arquivos e documentos, Imagens e design, Texto e escrita, Calculadoras, Produtividade, Desenvolvedores).
5. Benefícios: 4 pontos em linha editorial, sem cards repetitivos.
6. Nota sobre o modelo: gratuito, mantido por anúncios discretos.
7. Footer: Sobre, Contato, Privacidade, Termos, © 2026.

- Espaços de anúncio reservados (com altura fixa, evitando layout shift), vazios por enquanto.

## Rotas (um domínio, subdiretórios)

```text
/                     landing
/qr, /pdf, /senhas... página "em breve" de cada ferramenta (rota dinâmica a partir do catálogo)
/categorias/<slug>    lista por categoria
/sobre /contato /privacidade /termos
/sitemap.xml          gerado do catálogo
/robots.txt
```

Substitui o padrão `/tools/<slug>` anterior pelas URLs curtas que você pediu.

## Detalhes técnicos

- Catálogo único (`src/lib/catalog.ts`): ferramentas + categorias com slug, ícone, status (`planned`/`live`), metadados SEO. Nova ferramenta = nova entrada (+ rota própria quando ficar ativa); sem tocar no portal.
- Componentes reutilizáveis: Header, MobileNav, CommandSearch, ToolCard, CategoryIndex, AdSlot, Footer.
- SEO: head() por rota (title, description, OG, canonical), JSON-LD WebSite + SearchAction, sitemap dinâmico.
- Analytics/Search Console: deixados planejados (variável para o ID do GA e meta de verificação), não ativados ainda.
- Auditoria final com Playwright em 375px e 1280px: foco por teclado, contraste AA, layout shift.
- Remoção do conteúdo "ai-tools" anterior.
