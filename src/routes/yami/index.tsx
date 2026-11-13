import { Link, createFileRoute } from "@tanstack/react-router";
import { yamiHref, YAMI_SITE_URL } from "@/lib/yamiSite";

const TITLE = "YAMI — seu agente de IA";
const DESCRIPTION =
  "A YAMI é um assistente de IA que roda no seu Windows. Conversa, publica conteúdo com o Forage e pode ser usada de outro computador pelo navegador. Pagamento único, R$ 20,00.";

export const Route = createFileRoute("/yami/")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: "https://i-tools.shop/yami" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [{ rel: "canonical", href: "https://i-tools.shop/yami" }],
  }),
  component: YamiLanding,
});

function YamiLanding() {
  const comprar = yamiHref("/checkout", "landing-comprar");
  const site = yamiHref("/", "landing-home");
  const painel = yamiHref("/painel", "landing-painel");

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 md:pb-16 md:pt-14">
          <p className="eyebrow">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
            Ferramenta principal do i-Tools · Windows 10/11 x64
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.1] sm:text-5xl md:text-6xl">
            YAMI — seu agente de IA
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Um assistente que roda no seu Windows, no seu computador. Conversas,
            arquivos e histórico ficam aí. O Forage cria e publica conteúdo. E de
            outro computador, pelo navegador, você vê a mesma interface — enquanto
            o programa continua no seu PC.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href={comprar}
              className="border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:bg-primary hover:border-primary hover:text-primary-foreground"
            >
              Comprar por R$&nbsp;20,00
            </a>
            <a
              href={site}
              className="border border-border px-4 py-2 text-sm hover:border-foreground"
            >
              Ir ao site da YAMI
            </a>
            <p className="font-mono text-xs text-muted-foreground">
              Pagamento único · Pix ou cartão · no site da YAMI
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16" aria-labelledby="o-que-e">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <p className="eyebrow">01 — No seu PC</p>
            <h2 id="o-que-e" className="mt-3 text-2xl leading-tight">
              Local, no seu Windows
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A YAMI instala no seu computador. Histórico, arquivos e configurações
              ficam lá. Não é um chat que mora só na nuvem.
            </p>
          </div>
          <div>
            <p className="eyebrow">02 — Forage</p>
            <h2 className="mt-3 text-2xl leading-tight">Cria e publica conteúdo</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              O Forage é o agente da YAMI para texto e publicação, com as contas e
              os limites que você configurar. A publicação sai do aplicativo no seu PC.
            </p>
          </div>
          <div>
            <p className="eyebrow">03 — De outro PC</p>
            <h2 className="mt-3 text-2xl leading-tight">A mesma tela, no navegador</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              No{" "}
              <a href={painel} className="underline underline-offset-4">
                painel remoto
              </a>
              , no site da YAMI, você conversa e vê o Forage — enquanto o programa
              continua no seu PC. Se ele estiver desligado, o painel avisa.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <p className="eyebrow">Compra</p>
          <h2 className="mt-3 max-w-2xl text-3xl leading-tight">R$ 20,00, uma vez.</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            A compra, a licença, o download e a conta ficam no site da YAMI, não
            neste. As outras ferramentas do i-Tools continuam gratuitas.
          </p>
          <a
            href={comprar}
            className="mt-6 inline-block border border-foreground bg-foreground px-4 py-2 text-sm text-background hover:bg-primary hover:border-primary hover:text-primary-foreground"
          >
            Comprar no site da YAMI
          </a>
          <p className="mt-4 font-mono text-xs text-muted-foreground">
            {YAMI_SITE_URL.replace(/^https:\/\//, "")}
          </p>
          <p className="mt-8 text-sm">
            <Link to="/" className="underline underline-offset-4">
              Voltar às ferramentas do i-Tools
            </Link>
          </p>
        </div>
      </section>
    </article>
  );
}
