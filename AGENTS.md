<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Project rules

- The tool catalog lives in `src/lib/catalog.ts` — single source for home, search, categories and tool pages, so new tools need no portal changes.
- Tools use short top-level paths `/<slug>` (dynamic `src/routes/$tool.tsx`) on one domain, never subdomains; a live tool gets its own route file, which overrides the dynamic page.
- Shared site chrome/components live in `src/components/site/`; every page uses `PageShell` and `pageMeta` for consistent layout and SEO.
- Ad space uses fixed-height `AdSlot` to avoid layout shift.
- Monetag ads load only through `src/lib/ads.ts` config + `MonetagLoader` after hydration; only non-intrusive formats (no popunder/redirect) to protect UX.
- Video download pages share `VideoDownloader` and validated public links; FastSaver calls use a server function through its connector, and signed expiring tickets stream only allowlisted media through the same-origin download route. Mark each platform live only after its actual file download is verified.
- Local everyday tools keep calculation and transformation logic in a browser-safe, tested module; process text and passwords only in the browser to avoid transmitting user input.
- Image tools share a browser-only editor with bounded canvas dimensions; PDF conversions dynamically import the renderer and worker during user actions to keep SSR safe and files local.
- Public page URLs are centralized in `src/lib/seo.ts`; canonical, Open Graph and sitemap addresses share that origin to prevent conflicting search identities.
- Every route declares `staticData.sitemap`; the router-derived sitemap includes public static pages and all catalog tool/category URLs without duplicate entries or fabricated modification dates.
- The shared `Logo` renders the approved logo asset in all site headers and footers; the root favicon is derived from that same asset so browser identity stays consistent.
- Category accents are shared semantic tokens via `site/tool-appearance.ts`; reveal motion is managed by PageShell and always respects reduced-motion preferences.

- Admin credentials are server-only secrets; admin pages and RPC functions validate the same encrypted HttpOnly session before privileged operations. Analytics schema integration remains optional until its tables are deployed.
- Admin SEO generation uses the AI Gateway SDK inside a session-validated server function; validated editable drafts never overwrite public pages automatically, preventing unreviewed AI claims from being published.
- Language alternate links must preserve the leaf's self-referencing canonical via getSeoLinks, so multilingual metadata never discards page identity.
- Tool SEO titles, descriptions and explanatory context belong in the catalog and are consumed by ToolLayout; language alternates and sitemap entries advertise only equivalent usable pages, while translated placeholders remain noindex.
