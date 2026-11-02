import { createFileRoute } from "@tanstack/react-router";
import { ProsePage, pageMeta } from "@/components/site/Layout";

export const Route = createFileRoute("/termos")({
  head: () => pageMeta("Termos de uso — i-Tools", "Condições de uso das ferramentas gratuitas do i-Tools.", "/termos"),
  component: () => (
    <ProsePage title="Termos de uso" intro="Versão preliminar — será revisada antes do lançamento da primeira ferramenta.">
      <h2>Uso gratuito</h2>
      <p>As ferramentas do i-Tools são oferecidas gratuitamente, sem garantia de disponibilidade contínua, e mantidas por publicidade.</p>
      <h2>Responsabilidade</h2>
      <p>O usuário é responsável pelo conteúdo que processa nas ferramentas e pelo uso dos resultados obtidos.</p>
    </ProsePage>
  ),
});
