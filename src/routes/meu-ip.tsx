import { createFileRoute } from "@tanstack/react-router";
import { Copy, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { btnSecondary, panel, ToolLayout, toolHead } from "@/components/site/ToolLayout";

export const Route = createFileRoute("/meu-ip")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "meu-ip",
      "Qual é meu IP? Veja seu IP público agora — i-Tools",
      "Descubra o endereço IP público da sua conexão (IPv4 e IPv6) em um clique. Grátis e sem cadastro.",
    ),
  component: IpPage,
});

const faq = [
  {
    q: "O que é o IP público?",
    a: "É o endereço que identifica sua conexão na internet. Normalmente é o mesmo para todos os aparelhos ligados ao seu roteador.",
  },
  {
    q: "Por que meu IP muda?",
    a: "A maioria das operadoras usa IP dinâmico, que pode mudar ao reiniciar o roteador. VPNs também alteram o IP exibido.",
  },
  {
    q: "Este é o IP do meu computador na rede local?",
    a: "Não. O IP local (como 192.168.x.x) só existe dentro da sua rede; aqui mostramos o IP visto pela internet.",
  },
];

async function fetchIp(url: string) {
  try {
    const r = await fetch(url, { cache: "no-store" });
    return ((await r.json()) as { ip: string }).ip;
  } catch {
    return null;
  }
}

function IpPage() {
  const [v4, setV4] = useState<string | null | undefined>(undefined);
  const [v6, setV6] = useState<string | null | undefined>(undefined);
  const [copied, setCopied] = useState("");

  const load = useCallback(() => {
    setV4(undefined);
    setV6(undefined);
    fetchIp("https://api.ipify.org?format=json").then(setV4);
    fetchIp("https://api64.ipify.org?format=json").then((ip) =>
      setV6(ip && ip.includes(":") ? ip : null),
    );
  }, []);
  useEffect(load, [load]);

  const copy = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopied(ip);
    setTimeout(() => setCopied(""), 1500);
  };

  const Row = ({ label, ip }: { label: string; ip: string | null | undefined }) => (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border py-5 last:border-0">
      <div>
        <p className="eyebrow">{label}</p>
        <p className="mt-1 break-all font-mono text-2xl sm:text-3xl" aria-live="polite">
          {ip === undefined ? (
            <span className="text-muted-foreground">Consultando…</span>
          ) : (
            (ip ?? (
              <span className="text-base text-muted-foreground">Não disponível nesta conexão</span>
            ))
          )}
        </p>
      </div>
      {ip && (
        <button type="button" onClick={() => copy(ip)} className={btnSecondary}>
          <Copy className="h-4 w-4" aria-hidden />
          {copied === ip ? "Copiado!" : "Copiar"}
        </button>
      )}
    </div>
  );

  return (
    <ToolLayout
      slug="meu-ip"
      intro="Este é o endereço IP público que sites e serviços enxergam quando você acessa a internet."
      faq={faq}
    >
      <div className={panel}>
        <Row label="IPv4" ip={v4} />
        <Row label="IPv6" ip={v6} />
        <button
          type="button"
          onClick={load}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <RefreshCw className="h-4 w-4" aria-hidden /> Consultar novamente
        </button>
      </div>
    </ToolLayout>
  );
}
