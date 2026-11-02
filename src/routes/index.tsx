import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Globe, MousePointerClick, PackageOpen, Wallet } from "lucide-react";
import { AdSlot, PageShell, SectionHeading, pageMeta } from "@/components/site/Layout";
import { SearchPanel } from "@/components/site/SearchPanel";
import { ToolGrid } from "@/components/site/ToolCard";
import { categories, featuredTools, SITE, toolsByCategory } from "@/lib/catalog";
import { categoryAppearance } from "@/components/site/tool-appearance";

const title = "i-Tools — Ferramentas online gratuitas, direto no navegador";

export const Route = createFileRoute("/")({
  staticData: { sitemap: true },
  head: () => ({
    ...pageMeta(title, SITE.description, "/"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: SITE.name,
          inLanguage: "pt-BR",
          description: SITE.description,
        }),
      },
    ],
  }),
  component: Index,
});

const benefits = [
  {
    icon: Wallet,
    title: "Gratuito",
    text: "Sem planos, sem assinatura, sem recurso bloqueado. Mantido por anúncios discretos.",
  },
  {
    icon: MousePointerClick,
    title: "Fácil de usar",
    text: "Uma tarefa por página. Abra, resolva e siga em frente.",
  },
  {
    icon: PackageOpen,
    title: "Sem instalação",
    text: "Nada para baixar. Funciona no computador e no celular.",
  },
  {
    icon: Globe,
    title: "No navegador",
    text: "Sem cadastro. Sempre que possível, seus arquivos ficam no seu dispositivo.",
  },
];

function Index() {
  return (
    <PageShell>
      {/* Hero */}
      <section aria-labelledby="hero-title" className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 md:pb-12 md:pt-14">
          <p className="eyebrow flex items-center gap-2 animate-fade-in-up">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{" "}
            Seu dia a dia, mais simples
          </p>
          <h1
            id="hero-title"
            className="mt-5 max-w-4xl text-5xl leading-[1.08] sm:text-6xl md:text-7xl animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            i-Tools. <span className="block">Pequenas ferramentas.<br className="hidden sm:block" /> <em className="text-primary">Grandes soluções.</em></span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Um só endereço para converter arquivos, ajustar imagens, trabalhar textos e fazer
            cálculos — gratuito e direto no navegador.
          </p>
          <div className="mt-7 max-w-2xl animate-fade-in-up">
            <SearchPanel size="lg" />
          </div>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
            {["Grátis", "Sem cadastro", "No navegador"].map((label) => (
              <li key={label} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-accent" strokeWidth={1.5} aria-hidden />{label}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Featured */}
      <section aria-labelledby="destaques" className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
        <SectionHeading
          index="01"
          eyebrow="Destaques"
          id="destaques"
          title={
            <>
              O que vamos resolver hoje?
            </>
          }
        />
        <ToolGrid tools={featuredTools()} />
      </section>

      <AdSlot />

      {/* Categories */}
      <section aria-labelledby="categorias" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 md:py-20">
        <SectionHeading
          index="02"
          eyebrow="Categorias"
          id="categorias"
          title="Cada tarefa, no seu lugar."
        />
        <ol className="border-b border-border">
          {categories.map((c, i) => {
            const Icon = c.icon;
            const count = toolsByCategory(c.slug).length;
            return (
              <li data-reveal key={c.slug} className="border-t border-border">
                <Link
                  to="/categorias/$categoria"
                  params={{ categoria: c.slug }}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-5 transition-colors hover:bg-card sm:grid-cols-[3rem_2.5rem_1fr_1fr_auto] sm:gap-4 sm:px-2"
                >
                  <span className={`grid h-10 w-10 place-items-center rounded-md sm:bg-transparent sm:text-muted-foreground ${categoryAppearance[c.slug]}`}><c.icon className="h-5 w-5 sm:hidden" strokeWidth={1.5} aria-hidden /><span className="hidden font-mono text-sm sm:block">0{i + 1}</span></span>
                  <Icon
                    className="hidden h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary sm:block"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                   <span className="text-base font-medium sm:text-lg">{c.name}<span className="mt-1 block text-xs font-normal text-muted-foreground sm:hidden">{count} ferramenta{count !== 1 && "s"}</span></span>
                  <span className="hidden text-sm text-muted-foreground sm:block">
                    {c.description}
                  </span>
                  <span className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                    <span className="hidden sm:inline">{count} ferramenta{count !== 1 && "s"}</span>
                    <ArrowRight
                      className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                      aria-hidden
                    />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Benefits */}
      <section aria-labelledby="beneficios" className="bg-ink text-ink-foreground">
        <div data-reveal className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-12 grid gap-3 md:grid-cols-[180px_1fr]">
            <p className="font-mono text-xs uppercase text-ink-muted">
              03 — Por que i-Tools
            </p>
            <h2 id="beneficios" className="text-3xl leading-tight sm:text-4xl">
              Sem conta. Sem assinatura. <em className="text-primary">Sem complicação.</em>
            </h2>
          </div>
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                data-reveal
                className="animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="grid h-10 w-10 place-items-center text-primary transition-transform duration-300 hover:-translate-y-1">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Model note */}
      <section data-reveal aria-labelledby="modelo" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[180px_1fr]">
          <p className="eyebrow">04 — Como funciona</p>
          <div className="max-w-2xl">
            <h2 id="modelo" className="text-3xl leading-tight">
              Uma ferramenta de cada vez, bem feita.
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Lançamos cada ferramenta com cuidado, acompanhamos o uso e só então partimos para a
              próxima. O i-Tools é sustentado exclusivamente por anúncios, posicionados para não
              atrapalhar o que você veio fazer.
            </p>
            <Link
              to="/sobre"
              className="mt-6 inline-flex items-center gap-2 font-medium underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
            >
              Conheça o projeto i-Tools <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
