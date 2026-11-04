import { useEffect, useRef, type ReactNode } from "react";
import { pageUrl } from "@/lib/seo";
import { type LanguageCode } from "@/lib/i18n";
import { useI18n } from "@/lib/use-i18n";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { BackgroundEffects } from "./BackgroundEffects";

export function PageShell({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!shell.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-reveal-state", "visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    shell.current.querySelectorAll("[data-reveal]").forEach((element) => {
      if (element.getBoundingClientRect().top > window.innerHeight) {
        element.setAttribute("data-reveal-state", "pending");
      }
      observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={shell} className="relative flex min-h-screen flex-col">
      <BackgroundEffects />
      <SiteHeader />
      <main id="conteudo" className="relative z-10 flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

/** Reserved ad space with fixed height to avoid layout shift. Empty until an ad network is connected. */
export function AdSlot({ label }: { label?: string } = {}) {
  const { t } = useI18n();
  const adLabel = label || t.common.advertisement;
  
  return (
    <aside aria-label={adLabel} className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="flex h-24 items-center justify-center border-y border-border bg-muted/40 font-mono text-[10px] uppercase text-muted-foreground">
        {adLabel}
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
    <div data-reveal className="mb-8 grid gap-3 md:grid-cols-[180px_1fr] md:items-start">
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

export const pageMeta = (title: string, description: string, path: string, type = "website", lang?: LanguageCode) => {
  const currentLang = lang || "pt";
  const locale = currentLang === "pt" ? "pt_BR" : currentLang === "en" ? "en_US" : `${currentLang}_${currentLang.toUpperCase()}`;
  const canonicalUrl = pageUrl(path, currentLang);
  
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: canonicalUrl },
      { property: "og:locale", content: locale },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: canonicalUrl }],
  };
};
