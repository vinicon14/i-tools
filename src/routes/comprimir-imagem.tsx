import { createFileRoute } from "@tanstack/react-router";
import { useAnalytics } from "@/hooks/use-analytics";
import { ToolLayout, toolHead } from "@/components/site/ToolLayout";
import { ImageEditor } from "@/components/site/ImageEditor";
export const Route = createFileRoute("/comprimir-imagem")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "comprimir-imagem",
      "Compressor de imagens JPG, PNG e WebP grátis — i-Tools",
      "Comprima imagens JPG, PNG e WebP online, ajuste a qualidade e baixe arquivos menores. Grátis, sem cadastro e sem enviar suas fotos.",
    ),
  component: CompressPage,
});
function CompressPage() {
  useAnalytics('comprimir-imagem');

  return (
    <ToolLayout
      slug="comprimir-imagem"
      intro="Imagens mais leves, processadas no seu dispositivo."
      faq={[
        {
          q: "Quais formatos posso comprimir?",
          a: "JPG, PNG e WebP de até 30 MB e 24 megapixels. Escolha o formato de saída e, em JPG ou WebP, ajuste a qualidade.",
        },
        {
          q: "A compressão altera a qualidade?",
          a: "JPG e WebP podem perder detalhes ao reduzir a qualidade. PNG mantém os pixels, mas nem sempre fica menor. O tamanho final é exibido antes do download.",
        },
        {
          q: "Minhas fotos são enviadas?",
          a: "Não. A imagem é processada localmente no navegador. PNG e WebP preservam transparência; JPG usa fundo branco.",
        },
      ]}
    >
      <ImageEditor mode="compress" />
    </ToolLayout>
  );
}
