import { createFileRoute } from "@tanstack/react-router";
import { ProsePage, pageMeta } from "@/components/site/Layout";
import { getPrivacyAnalyticsText } from "@/lib/i18n-privacy";

export const Route = createFileRoute("/privacidade")({
  staticData: { sitemap: true },
  head: () =>
    pageMeta(
      "Política de privacidade — i-Tools",
      "Como o i-Tools trata dados, cookies e publicidade.",
      "/privacidade",
    ),
  component: () => {
    // Detect browser language or use default
    const browserLang = typeof navigator !== 'undefined' ? navigator.language : 'pt';
    const analyticsText = getPrivacyAnalyticsText(browserLang);

    return (
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
        <h2>{analyticsText.title}</h2>
        <p>
          {analyticsText.content}
        </p>
      </ProsePage>
    );
  },
});
