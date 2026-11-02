import { createFileRoute } from "@tanstack/react-router";
import { Copy, MapPin } from "lucide-react";
import { useState } from "react";
import {
  btnPrimary,
  btnSecondary,
  panel,
  ToolLayout,
  toolHead,
} from "@/components/site/ToolLayout";

export const Route = createFileRoute("/meu-cep")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "meu-cep",
      "Qual é meu CEP? Descubra pela localização — i-Tools",
      "Descubra o CEP e o endereço aproximado de onde você está usando a localização do celular ou computador. Grátis e sem cadastro.",
    ),
  component: CepPage,
});

const faq = [
  {
    q: "O CEP é exato?",
    a: "É uma estimativa baseada na sua localização e em dados abertos do OpenStreetMap. Confira com os Correios antes de usar em envios.",
  },
  {
    q: "Vocês guardam minha localização?",
    a: "Não. As coordenadas são usadas apenas para consultar o endereço e não são armazenadas pelo i-Tools.",
  },
  {
    q: "Por que preciso permitir a localização?",
    a: "Sem a permissão o navegador não informa onde você está. Você pode negar ou revogar a qualquer momento.",
  },
];

type Result = {
  cep?: string;
  rua?: string;
  bairro?: string;
  cidade?: string;
  uf?: string | undefined;
};
type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; msg: string }
  | { kind: "ok"; data: Result };

function CepPage() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [copied, setCopied] = useState(false);

  const locate = () => {
    if (!("geolocation" in navigator))
      return setState({ kind: "error", msg: "Seu navegador não oferece localização." });
    setState({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=pt-BR&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const a = (await r.json()).address ?? {};
          const uf: string | undefined =
            (a["ISO3166-2-lvl4"] as string | undefined)?.split("-")[1] ?? undefined;
          setState({
            kind: "ok",
            data: {
              cep: a.postcode,
              rua: a.road,
              bairro: a.suburb ?? a.neighbourhood,
              cidade: a.city ?? a.town ?? a.village,
              uf,
            },
          });
        } catch {
          setState({
            kind: "error",
            msg: "Não foi possível consultar o endereço. Tente novamente.",
          });
        }
      },
      (err) =>
        setState({
          kind: "error",
          msg:
            err.code === 1
              ? "Permissão de localização negada. Libere-a nas configurações do navegador."
              : "Não foi possível obter sua localização.",
        }),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  return (
    <ToolLayout
      slug="meu-cep"
      intro="Toque no botão, permita a localização e veja o CEP aproximado de onde você está."
      faq={faq}
    >
      <div className={panel} aria-live="polite">
        {state.kind === "ok" ? (
          <div>
            <p className="eyebrow">CEP aproximado</p>
            <p className="mt-1 font-mono text-4xl sm:text-5xl">
              {state.data.cep ?? "Não encontrado"}
            </p>
            <p className="mt-3 text-muted-foreground">
              {[
                state.data.rua,
                state.data.bairro,
                state.data.cidade &&
                  `${state.data.cidade}${state.data.uf ? ` - ${state.data.uf}` : ""}`,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {state.data.cep && (
                <button
                  type="button"
                  className={btnPrimary}
                  onClick={() => {
                    navigator.clipboard.writeText(state.data.cep!);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                  }}
                >
                  <Copy className="h-4 w-4" aria-hidden />
                  {copied ? "Copiado!" : "Copiar CEP"}
                </button>
              )}
              <button type="button" className={btnSecondary} onClick={locate}>
                Atualizar localização
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-start gap-4">
            <button
              type="button"
              onClick={locate}
              disabled={state.kind === "loading"}
              className={btnPrimary}
            >
              <MapPin className="h-4 w-4" aria-hidden />
              {state.kind === "loading" ? "Localizando…" : "Descobrir meu CEP"}
            </button>
            {state.kind === "error" && (
              <p role="alert" className="text-sm text-destructive">
                {state.msg}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              Dados de endereço © colaboradores do OpenStreetMap.
            </p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
