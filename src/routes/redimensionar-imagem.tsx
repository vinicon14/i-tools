import { createFileRoute } from "@tanstack/react-router";
import { useAnalytics } from "@/hooks/use-analytics";
import { ToolLayout, toolHead } from "@/components/site/ToolLayout";
import { ImageEditor } from "@/components/site/ImageEditor";
export const Route = createFileRoute("/redimensionar-imagem")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "redimensionar-imagem",
      "Redimensionar imagem online em pixels — i-Tools",
      "Altere largura e altura de imagens JPG, PNG e WebP, mantenha a proporção e baixe o resultado. Redimensionador gratuito, sem cadastro.",
    ),
  component: ResizePage,
});
function ResizePage() {
  useAnalytics('redimensionar-imagem');

  return (
    <ToolLayout
      slug="redimensionar-imagem"
      intro="O tamanho certo para sua imagem, sem enviar arquivos."
      faq={[
        {
          q: "Como manter a proporção?",
          a: "Com Manter proporção selecionado, alterar largura ou altura ajusta a outra dimensão automaticamente. Desmarcar permite definir dimensões independentes, o que pode distorcer a imagem.",
        },
        {
          q: "Aumentar uma imagem melhora a resolução?",
          a: "Não. A ferramenta interpola os pixels, mas não recupera detalhes que não existem no original.",
        },
        {
          q: "Quais são os limites?",
          a: "Imagens JPG, PNG e WebP de até 30 MB. As dimensões precisam ser inteiras, até 12.000 pixels por lado e 24 megapixels no total.",
        },
      ]}
    >
      <ImageEditor mode="resize" />
    </ToolLayout>
  );
}
