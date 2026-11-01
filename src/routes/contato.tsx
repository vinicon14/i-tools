import { createFileRoute } from "@tanstack/react-router";
import { ProsePage, pageMeta } from "@/components/site/Layout";

export const Route = createFileRoute("/contato")({
  head: () => pageMeta("Contato — i-Tools", "Fale com a equipe do i-Tools: sugestões de ferramentas, parcerias e dúvidas.", "/contato"),
  component: () => (
    <ProsePage title="Contato" intro="Sugestões de ferramentas, parcerias ou dúvidas.">
      <p>Nosso canal de contato oficial será publicado aqui em breve.</p>
      <p>Enquanto isso, as sugestões de novas ferramentas são bem-vindas e ajudarão a definir a ordem dos próximos lançamentos.</p>
    </ProsePage>
  ),
});
