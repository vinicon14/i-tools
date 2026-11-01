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
