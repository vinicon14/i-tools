import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Megaphone, Search, UserX, Wallet } from "lucide-react";
import { SiteFooter, SiteHeader, ToolCard } from "@/components/site";
import { categories, plannedTools, searchPlanned } from "@/lib/tools";

const title = "ai-tools — Ferramentas de IA gratuitas (em breve)";
const description =
  "Portal brasileiro de ferramentas de IA em preparação. Todas serão gratuitas, mantidas apenas por anúncios: sem conta, sem assinatura e sem paywall.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

const values = [
  { icon: Wallet, title: "100% gratuito", text: "Nenhuma cobrança, agora ou depois." },
  { icon: UserX, title: "Sem conta", text: "Sem cadastro, login ou e-mail." },
  { icon: BadgeCheck, title: "Sem paywall", text: "Nada de assinatura ou recurso bloqueado." },
  { icon: Megaphone, title: "Mantido por anúncios", text: "A publicidade é a única fonte de receita." },
];

function Index() {
  const [query, setQuery] = useState("");
  const results = searchPlanned(query);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="hero-grid bg-hero text-hero-foreground" aria-labelledby="hero-title">
          <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
            <p className="mb-4 inline-block rounded-full bg-accent px-3 py-1 text-sm font-semibold text-accent-foreground">
              Em preparação · nenhuma ferramenta disponível ainda
            </p>
            <h1 id="hero-title" className="max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">
              Ferramentas de IA simples, gratuitas e sem cadastro.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-hero-muted">
              Estamos construindo um portal de ferramentas de IA em português. Quando lançadas, todas serão gratuitas e
              mantidas apenas por anúncios — sem conta, sem assinatura, sem paywall.
            </p>
            <a href="#ferramentas" className="mt-8 inline-flex rounded-lg bg-accent px-5 py-3 font-semibold text-accent-foreground hover:opacity-90">
              Ver ferramentas planejadas
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="valores">
          <h2 id="valores" className="text-3xl font-semibold">Nossa proposta</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-xl border border-border bg-card p-5">
                <Icon className="h-6 w-6 text-primary" aria-hidden />
                <h3 className="mt-3 text-lg font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-muted" aria-labelledby="categorias">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <h2 id="categorias" className="text-3xl font-semibold">Categorias</h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categories.map((c) => (
                <li key={c.id} className="rounded-xl bg-card p-5">
                  <h3 className="text-lg font-semibold">{c.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="ferramentas" className="mx-auto max-w-6xl px-4 py-14" aria-labelledby="planejadas">
          <h2 id="planejadas" className="text-3xl font-semibold">Ferramentas planejadas</h2>
          <p className="mt-2 text-muted-foreground">Nenhuma delas está disponível ainda. Todas estão marcadas como “em breve”.</p>

          <form role="search" className="mt-6 max-w-xl" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="busca" className="mb-2 block text-sm font-semibold">Buscar entre as ferramentas planejadas</label>
            <div className="flex items-center gap-2 rounded-lg border border-input bg-card px-3 focus-within:ring-2 focus-within:ring-ring">
              <Search className="h-4 w-4 text-muted-foreground" aria-hidden />
              <input id="busca" type="search" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Ex.: resumo, e-mail, imagem" className="w-full bg-transparent py-3 outline-none" />
            </div>
          </form>
          <div aria-live="polite" className="mt-3 text-sm text-muted-foreground">
            {query.trim() && (
              <p>
                As ferramentas ainda estão sendo preparadas — nenhuma está disponível para uso.{" "}
                {results.length > 0 ? `${results.length} ferramenta(s) planejada(s) correspondem à busca.` : "Nenhuma ferramenta planejada corresponde à busca."}
              </p>
            )}
          </div>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(query.trim() ? results : plannedTools).map((t) => <ToolCard key={t.slug} tool={t} />)}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
