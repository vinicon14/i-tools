import { createFileRoute } from "@tanstack/react-router";
import { LocalizedQrGenerator } from "@/components/site/LocalizedQrGenerator";
import { toolHead } from "@/components/site/ToolLayout";
import { getQrTranslations } from "@/lib/qr-translations";

const faq = getQrTranslations("pt").faq;

export const Route = createFileRoute("/qr")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "qr",
      "Gerador de QR Code grátis a partir de link — i-Tools",
      "Crie um QR Code a partir de qualquer URL e baixe em PNG ou SVG. Grátis, sem cadastro e feito no seu navegador.",
      faq,
    ),
  component: QrPage,
});

function QrPage() {
  return <LocalizedQrGenerator lang="pt" />;
}
