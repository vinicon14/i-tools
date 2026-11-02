# 🧰 i-Tools — Ferramentas Gratuitas

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](#)
[![Stack](https://img.shields.io/badge/stack-TanStack%20Start-ff4154?style=for-the-badge&logo=react)](#)
[![Ads](https://img.shields.io/badge/ads-Monetag-orange?style=for-the-badge)](#)
[![Tools](https://img.shields.io/badge/ferramentas-gratuitas-8A2BE2?style=for-the-badge)](#)

> Portal brasileiro de **ferramentas online gratuitas**, sem cadastro, sem assinatura e sem paywall.  
> Suportado apenas por anúncios (Monetag). Rápido, leve e feito para todos.

---

## ✨ Destaques

- 🆓 **100% gratuito** — sem conta, sem login, sem assinatura
- ⚡ **Leve e rápido** — sem imagens pesadas, CSS otimizado, carregamento instantâneo
- 📱 **Mobile-first** — layout responsivo e acessível (teclado/foco)
- 🔍 **SEO completo** — title, description, Open Graph, dados estruturados (JSON-LD), FAQ
- 📣 **Anúncios não intrusivos** — Monetag carregado após hidratação, apenas formatos seguros (sem popunder/redirect)
- 🧩 **Catálogo centralizado** — uma única fonte (`src/lib/catalog.ts`) alimenta home, busca, categorias e páginas de ferramentas
- 🗺️ **Rotas curtas** — `/slug` em um único domínio (sem subdomínios)

---

## 🛠️ Ferramentas

| Ferramenta                | Status       | Rota                      |
| ------------------------- | ------------ | ------------------------- |
| QR Code                   | ✅ No ar     | `/qr`                     |
| Meu IP                    | ✅ No ar     | `/meu-ip`                 |
| Meu CEP                   | ✅ No ar     | `/meu-cep`                |
| Baixar vídeo do YouTube   | 🟡 Planejado | `/baixar-video-youtube`   |
| Baixar vídeo do TikTok    | 🟡 Planejado | `/baixar-video-tiktok`    |
| Baixar vídeo do Instagram | 🟡 Planejado | `/baixar-video-instagram` |

> Ferramentas de download de vídeo permanecem **planejadas** até que um provedor documentado seja conectado e downloads reais sejam verificados — para nunca misrepresented readiness.

---

## 🧱 Stack

- **Framework:** TanStack Start (React Router v7, SSR/SPA híbrido)
- **UI:** React 19, Radix UI, Tailwind CSS v4, lucide-react
- **Build:** Vite 8, Nitro (deploy edge)
- **Linguagem:** TypeScript
- **Testes:** Vitest + Testing Library (jsdom)
- **Lint/Format:** ESLint + Prettier
- **Ads:** Monetag (via `src/lib/ads.ts` + `MonetagLoader`, pós-hidratação)
- **Banco de dados:** nenhum — site 100% estático

---

## 📁 Estrutura

```
i-tools/
├── public/                  # assets estáticos (imagens, favicon)
├── src/
│   ├── components/
│   │   ├── site/            # chrome compartilhado (PageShell, AdSlot, MonetagLoader, ...)
│   │   └── ui/              # componentes Radix/shadcn
│   ├── hooks/
│   ├── lib/
│   │   ├── catalog.ts       # ⭐ fonte única do catálogo de ferramentas
│   │   ├── ads.ts           # config Monetag
│   │   └── error-page.ts
│   ├── routes/              # rotas (file-based)
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   ├── $tool.tsx        # página dinâmica por slug
│   │   └── *.tsx            # rotas específicas (override da dinâmica)
│   ├── test/                # testes Vitest
│   └── start.ts             # instância TanStack Start
├── .env
├── package.json
└── vite.config.ts
```

---

## 🚀 Como rodar

### Pré-requisitos

- Node.js 20+ (ou Bun)
- npm / bun

### Instalação

```sh
git clone https://github.com/vinicon14/jeito-facil-ferramentas-livres.git
cd jeito-facil-ferramentas-livres
bun install   # ou: npm install
```

### Desenvolvimento

```sh
bun run dev   # ou: npm run dev
```

Acesse `http://localhost:3000` (ou a porta indicada no terminal).

### Qualidade

```sh
bun run lint       # ESLint
bun run format     # Prettier
bun run test       # Vitest
bun run build      # build de produção
bun run preview    # preview do build
```

---

## 📣 Configurar Monetag

1. Crie sua conta em [Monetag](https://monetag.com) e obtenha o **src** + **zone**.
2. Edite `src/lib/ads.ts` com seus valores.
3. Reinicie o dev server.

> Apenas formatos **não intrusivos** são permitidos (sem popunder/redirect) para proteger a UX.

---

## 🌐 Deploy

O projeto gera output Nitro (`.output/`) pronto para edge (Cloudflare Workers, Vercel, Netlify, etc.).

```sh
bun run build
# preview local
bun run preview
```

> Sitemap.xml, Google Analytics e Search Console estão no roadmap e aguardam domínio/IDs definitivos.

---

## 🗺️ Roadmap

- [x] Páginas de YouTube, TikTok e Instagram com SEO e validação de links
- [x] Landing do i-Tools
- [x] Ferramentas no ar: QR Code, Meu IP, Meu CEP
- [x] SEO por ferramenta (título, descrição, OG, dados estruturados, FAQ)
- [x] Estrutura da Monetag pronta
- [ ] Downloads reais de YouTube/TikTok/Instagram (aguardando serviço externo + credenciais)
- [ ] Ativar Monetag (aguardando código da tag)
- [ ] Sitemap.xml (aguardando domínio definitivo)
- [ ] Google Analytics / Search Console (aguardando IDs)

---

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Commit: `git commit -m "feat: minha feature"`
4. Push: `git push origin feat/minha-feature`
5. Abra um Pull Request

> Projeto conectado ao [Lovable](https://lovable.dev) — commits no `main` sincronizam com o editor. Evite reescrever histórico (force push/rebase de commits já publicados).

---

## 📄 Licença

Distribuído sob a licença MIT. Veja `LICENSE` para mais detalhes.

---

<p align="center">
  Feito com ❤️ no Brasil · i-Tools
</p>
