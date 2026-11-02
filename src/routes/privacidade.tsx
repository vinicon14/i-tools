import { createFileRoute } from "@tanstack/react-router";
import { ProsePage, pageMeta } from "@/components/site/Layout";

export const Route = createFileRoute("/privacidade")({
  staticData: { sitemap: true },
  head: () =>
    pageMeta(
      "Política de privacidade — i-Tools",
      "Como o i-Tools trata dados, cookies e publicidade.",
      "/privacidade",
    ),
  component: () => (
    <ProsePage
      title="Política de privacidade"
      intro="Versão preliminar — será revisada antes do lançamento da primeira ferramenta."
    >
      <h2>Sem cadastro</h2>
      <p>
        O i-Tools não exige criação de conta e não solicita dados pessoais para uso das ferramentas.
      </p>
      <h2>Arquivos</h2>
      <p>
        Sempre que tecnicamente possível, os arquivos serão processados no seu próprio dispositivo,
        sem envio a servidores.
      </p>
      <h2>Cookies e publicidade</h2>
      <p>
        O site poderá utilizar cookies de medição de audiência e de redes de anúncios. Detalhes
        sobre cada parceiro serão listados aqui, em conformidade com a LGPD.
      </p>
      <h2>Analytics e estatísticas</h2>
      <p>
        Para melhorar nossos serviços, coletamos estatísticas de uso de forma anônima, incluindo
        informações sobre páginas visitadas, ferramentas utilizadas e localização aproximada
        (país/cidade). Seu endereço IP nunca é armazenado de forma identificável e todos os dados
        são agregados e anonimizados em conformidade com a LGPD.
      </p>
    </ProsePage>
  ),
});
