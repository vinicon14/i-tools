import { createFileRoute, notFound } from "@tanstack/react-router";
import { Copy, MapPin, Search, Map as MapIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  btnPrimary,
  btnSecondary,
  panel,
  ToolLayout,
  toolHead,
} from "@/components/site/ToolLayout";
import { isValidLanguage, type LanguageCode } from "@/lib/i18n";
import { getToolTranslations } from "@/lib/tool-translations";
import { getTranslations } from "@/lib/translations";

const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

type AddressData = {
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
  complemento?: string;
  lat?: number;
  lng?: number;
};

type State =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; msg: string }
  | { kind: "ok"; data: AddressData };

async function fetchViaCEP(cep: string): Promise<AddressData | null> {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;
    const r = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!r.ok) return null;
    const data = await r.json();
    if (data.erro) return null;
    return {
      cep: data.cep,
      rua: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      uf: data.uf,
      complemento: data.complemento,
    };
  } catch {
    return null;
  }
}

async function fetchBrasilAPI(cep: string): Promise<AddressData | null> {
  try {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return null;
    const r = await fetch(`https://brasilapi.com.br/api/cep/v2/${cleanCep}`);
    if (!r.ok) return null;
    const data = await r.json();
    return {
      cep: data.cep,
      rua: data.street,
      bairro: data.neighborhood,
      cidade: data.city,
      uf: data.state,
      lat: data.location?.coordinates?.latitude,
      lng: data.location?.coordinates?.longitude,
    };
  } catch {
    return null;
  }
}

async function searchAddressByCEP(cep: string): Promise<AddressData | null> {
  let result = await fetchViaCEP(cep);
  if (result) return result;
  result = await fetchBrasilAPI(cep);
  return result;
}

async function searchCEPByAddress(
  uf: string,
  cidade: string,
  rua: string,
): Promise<AddressData[]> {
  try {
    const cleanUF = uf.trim();
    const cleanCidade = cidade.trim();
    const cleanRua = rua.trim();
    if (!cleanUF || !cleanCidade || !cleanRua || cleanRua.length < 3) return [];
    const url = `https://viacep.com.br/ws/${cleanUF}/${encodeURIComponent(cleanCidade)}/${encodeURIComponent(cleanRua)}/json/`;
    const r = await fetch(url);
    if (!r.ok) return [];
    const data = await r.json();
    if (!Array.isArray(data)) return [];
    return data.map((item: any) => ({
      cep: item.cep,
      rua: item.logradouro,
      bairro: item.bairro,
      cidade: item.localidade,
      uf: item.uf,
      complemento: item.complemento,
    }));
  } catch {
    return [];
  }
}

export const Route = createFileRoute("/$lang/meu-cep")({
  staticData: { sitemap: true },
  beforeLoad: ({ params }) => {
    if (!isValidLanguage(params.lang) || params.lang === "pt") {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const lang = params.lang as LanguageCode;
    const t = getToolTranslations(lang);
    return toolHead(
      "meu-cep",
      `${t.meuCep.tabs.cep} — i-Tools`,
      t.meuCep.intro,
      t.meuCep.faq,
      lang,
    );
  },
  component: CepPageLocalized,
});

function CepPageLocalized() {
  const { lang } = Route.useParams();
  const t = getToolTranslations(lang as LanguageCode);
  const labels = t.meuCep.labels;
  const placeholders = t.meuCep.placeholders;
  const errors = t.meuCep.errors;

  const [locationState, setLocationState] = useState<State>({ kind: "idle" });
  const [cepSearchState, setCepSearchState] = useState<State>({ kind: "idle" });
  const [addressSearchState, setAddressSearchState] = useState<{
    kind: "idle" | "loading" | "error" | "ok";
    msg?: string;
    results?: AddressData[];
  }>({ kind: "idle" });

  const [cepInput, setCepInput] = useState("");
  const [ufInput, setUfInput] = useState("");
  const [cidadeInput, setCidadeInput] = useState("");
  const [ruaInput, setRuaInput] = useState("");

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const locate = () => {
    if (!("geolocation" in navigator))
      return setLocationState({ kind: "error", msg: errors.noBrowser });
    setLocationState({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=${lang}&lat=${coords.latitude}&lon=${coords.longitude}`,
          );
          const a = (await r.json()).address ?? {};
          const uf: string | undefined =
            (a["ISO3166-2-lvl4"] as string | undefined)?.split("-")[1] ?? undefined;
          setLocationState({
            kind: "ok",
            data: {
              cep: a.postcode || "",
              rua: a.road || "",
              bairro: a.suburb || a.neighbourhood || "",
              cidade: a.city || a.town || a.village || "",
              uf: uf || "",
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });
        } catch {
          setLocationState({
            kind: "error",
            msg: errors.addressFailed,
          });
        }
      },
      (err) =>
        setLocationState({
          kind: "error",
          msg: err.code === 1 ? errors.permissionDenied : errors.locationFailed,
        }),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const searchByCEP = async () => {
    if (!cepInput.trim()) {
      setCepSearchState({ kind: "error", msg: errors.noCep });
      return;
    }
    setCepSearchState({ kind: "loading" });
    const result = await searchAddressByCEP(cepInput);
    if (result) {
      setCepSearchState({ kind: "ok", data: result });
    } else {
      setCepSearchState({ kind: "error", msg: errors.cepNotFound });
    }
  };

  const searchByAddress = async () => {
    if (!ufInput || !cidadeInput.trim() || !ruaInput.trim()) {
      setAddressSearchState({ kind: "error", msg: errors.fillAllFields });
      return;
    }
    if (ruaInput.trim().length < 3) {
      setAddressSearchState({
        kind: "error",
        msg: errors.streetTooShort,
      });
      return;
    }
    setAddressSearchState({ kind: "loading" });
    const results = await searchCEPByAddress(ufInput, cidadeInput, ruaInput);
    if (results.length > 0) {
      setAddressSearchState({ kind: "ok", results });
    } else {
      setAddressSearchState({ kind: "error", msg: errors.cepNotFound });
    }
  };

  const copyToClipboardAddress = (cep: string) => {
    navigator.clipboard.writeText(cep);
    setCopiedAddress(cep);
    setTimeout(() => setCopiedAddress(null), 1500);
  };

  const formatCEP = (cep: string) => {
    const clean = cep.replace(/\D/g, "");
    if (clean.length === 8) {
      return `${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    return cep;
  };

  const renderAddressResult = (data: AddressData, showMap: boolean = true) => {
    const mapUrl =
      data.lat && data.lng
        ? `https://www.openstreetmap.org/?mlat=${data.lat}&mlon=${data.lng}#map=18/${data.lat}/${data.lng}`
        : `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${data.rua}, ${data.cidade}, ${data.uf}, Brasil`)}`;

    return (
      <div>
        <p className="eyebrow">{labels.addressFound}</p>
        <p className="mt-1 font-mono text-3xl sm:text-4xl">{formatCEP(data.cep)}</p>
        <div className="mt-3 space-y-1 text-sm text-muted-foreground">
          {data.rua && <p>{data.rua}</p>}
          {data.bairro && <p>{data.bairro}</p>}
          {data.cidade && (
            <p>
              {data.cidade} - {data.uf}
            </p>
          )}
          {data.complemento && <p className="text-xs">{data.complemento}</p>}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          {showMap && (
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={btnPrimary}
            >
              <MapIcon className="h-4 w-4" aria-hidden />
              {labels.viewOnMap}
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    );
  };

  const translations = getTranslations(lang as LanguageCode);
  const toolTranslation = translations.tools["meu-cep" as keyof typeof translations.tools];
  const categoryTranslation = translations.categories.produtividade;
  
  return (
    <ToolLayout
      slug="meu-cep"
      intro={t.meuCep.intro}
      faq={t.meuCep.faq}
      lang={lang}
      toolName={toolTranslation?.name}
      categoryName={categoryTranslation?.name}
      translations={{
        home: translations.nav.home,
        faq: translations.common.faq,
        alsoIn: translations.common.alsoIn,
      }}
    >
      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t.meuCep.tabs.location}</span>
            <span className="sm:hidden">{labels.discover}</span>
          </TabsTrigger>
          <TabsTrigger value="cep">
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t.meuCep.tabs.cep}</span>
            <span className="sm:hidden">{labels.cep}</span>
          </TabsTrigger>
          <TabsTrigger value="address">
            <MapIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t.meuCep.tabs.address}</span>
            <span className="sm:hidden">{labels.street}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="location">
          <div className={panel} aria-live="polite">
            {locationState.kind === "ok" ? (
              renderAddressResult(locationState.data)
            ) : (
              <div className="flex flex-col items-start gap-4">
                <button
                  type="button"
                  onClick={locate}
                  disabled={locationState.kind === "loading"}
                  className={btnPrimary}
                >
                  <MapPin className="h-4 w-4" aria-hidden />
                  {locationState.kind === "loading" ? labels.discovering : labels.discover}
                </button>
                {locationState.kind === "error" && (
                  <p role="alert" className="text-sm text-destructive">
                    {locationState.msg}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {t.meuCep.attribution}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cep">
          <div className={panel}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cep-input">{labels.cep}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="cep-input"
                    placeholder={placeholders.cep}
                    value={cepInput}
                    onChange={(e) => setCepInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByCEP()}
                    maxLength={9}
                  />
                  <button
                    type="button"
                    onClick={searchByCEP}
                    disabled={cepSearchState.kind === "loading"}
                    className={btnPrimary}
                  >
                    <Search className="h-4 w-4" aria-hidden />
                    {cepSearchState.kind === "loading" ? labels.searching : labels.search}
                  </button>
                </div>
              </div>
              {cepSearchState.kind === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {cepSearchState.msg}
                </p>
              )}
              {cepSearchState.kind === "ok" && (
                <div className="mt-6 pt-6 border-t border-border">
                  {renderAddressResult(cepSearchState.data)}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="address">
          <div className={panel}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="uf-input">{labels.state}</Label>
                  <Select value={ufInput} onValueChange={setUfInput}>
                    <SelectTrigger id="uf-input" className="mt-2">
                      <SelectValue placeholder={labels.selectState} />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS.map((e) => (
                        <SelectItem key={e.uf} value={e.uf}>
                          {e.uf} - {e.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cidade-input">{labels.city}</Label>
                  <Input
                    id="cidade-input"
                    placeholder={placeholders.city}
                    value={cidadeInput}
                    onChange={(e) => setCidadeInput(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="rua-input">{labels.street}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="rua-input"
                    placeholder={placeholders.street}
                    value={ruaInput}
                    onChange={(e) => setRuaInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchByAddress()}
                  />
                  <button
                    type="button"
                    onClick={searchByAddress}
                    disabled={addressSearchState.kind === "loading"}
                    className={btnPrimary}
                  >
                    <Search className="h-4 w-4" aria-hidden />
                    {addressSearchState.kind === "loading" ? labels.searching : labels.search}
                  </button>
                </div>
              </div>
              {addressSearchState.kind === "error" && (
                <p role="alert" className="text-sm text-destructive">
                  {addressSearchState.msg}
                </p>
              )}
              {addressSearchState.kind === "ok" && addressSearchState.results && (
                <div className="mt-6 pt-6 border-t border-border space-y-4">
                  <p className="eyebrow">
                    {labels.resultsFound(addressSearchState.results.length)}
                  </p>
                  <div className="space-y-4">
                    {addressSearchState.results.map((result, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-md border border-border bg-background"
                      >
                        <p className="font-mono text-xl font-semibold">
                          {formatCEP(result.cep)}
                        </p>
                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                          {result.rua && <p>{result.rua}</p>}
                          {result.bairro && <p>{result.bairro}</p>}
                          {result.cidade && (
                            <p>
                              {result.cidade} - {result.uf}
                            </p>
                          )}
                          {result.complemento && <p className="text-xs">{result.complemento}</p>}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:border-foreground"
                            onClick={() => copyToClipboardAddress(result.cep)}
                          >
                            <Copy className="h-3 w-3" aria-hidden />
                            {copiedAddress === result.cep ? "Copied!" : labels.cep}
                          </button>
                          <a
                            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${result.rua}, ${result.cidade}, ${result.uf}, Brasil`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:border-foreground"
                          >
                            <MapIcon className="h-3 w-3" aria-hidden />
                            {labels.viewOnMap}
                            <ExternalLink className="h-3 w-3" aria-hidden />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolLayout>
  );
}
