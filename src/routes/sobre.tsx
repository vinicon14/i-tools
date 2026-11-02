import { createFileRoute } from "@tanstack/react-router";
import { ProsePage, pageMeta } from "@/components/site/Layout";

export const Route = createFileRoute("/sobre")({
  head: () =>
    pageMeta(
      "Sobre o i-Tools — ferramentas online gratuitas",
      "O que é o i-Tools, como é mantido e como as ferramentas são lançadas.",
      "/sobre",
    ),
  component: () => (
    <ProsePage
      title="Sobre o i-Tools"
      intro="Ferramentas práticas para tarefas do dia a dia, reunidas em um só endereço."
    >
      <p>
        O i-Tools reúne ferramentas online gratuitas que funcionam direto no navegador: converter
        arquivos, ajustar imagens, trabalhar textos, fazer cálculos e muito mais.
      </p>
      <h2>Gratuito de verdade</h2>
      <p>
        Não há planos pagos, assinaturas ou cadastro. O projeto é mantido exclusivamente por
        publicidade, posicionada para não atrapalhar o uso.
      </p>
      <h2>Uma ferramenta por vez</h2>
      <p>
        Cada ferramenta é lançada individualmente, em sua própria página, e só depois partimos para
        a próxima. Por isso, as ferramentas listadas hoje aparecem como “em breve”.
      </p>
    </ProsePage>
  ),
});
