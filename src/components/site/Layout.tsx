import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="conteudo" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** Reserved ad space with fixed height to avoid layout shift. Empty until an ad network is connected. */
export function AdSlot({ label = "Publicidade" }: { label?: string }) {
  return (
    <aside aria-label={label} className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex h-24 items-center justify-center rounded-md border border-dashed border-border font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </aside>
  );
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  id,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  id: string;
}) {
  return (
    <div className="mb-10 grid gap-3 border-t border-foreground pt-4 md:grid-cols-[180px_1fr]">
      <p className="eyebrow">
        {index} — {eyebrow}
      </p>
      <h2 id={id} className="text-3xl leading-tight sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export function ProsePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{intro}</p>
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed [&_h2]:mt-10 [&_h2]:font-sans [&_h2]:text-lg [&_h2]:font-semibold">
          {children}
        </div>
      </article>
    </PageShell>
  );
}

export const pageMeta = (title: string, description: string, path: string, type = "website") => ({
  meta: [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { property: "og:locale", content: "pt_BR" },
    { name: "twitter:card", content: "summary_large_image" },
  ],
  links: [{ rel: "canonical", href: path }],
});
