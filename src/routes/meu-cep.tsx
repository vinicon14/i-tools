import { createFileRoute } from "@tanstack/react-router";
import { Copy, MapPin, Search, Map as MapIcon, ExternalLink } from "lucide-react";
import { useState } from "react";
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

const faq = [
  {
    q: "O CEP é exato?",
    a: "Sim! Ao buscar por CEP, retornamos os dados oficiais dos Correios via ViaCEP. Para busca por localização GPS, é uma estimativa baseada em dados do OpenStreetMap.",
  },
  {
    q: "Vocês guardam minha localização?",
    a: "Não. As coordenadas e endereços são processados apenas no seu navegador e não são armazenadas pelo i-Tools.",
  },
  {
    q: "Como funciona a busca reversa de CEP?",
    a: "Digite o estado, cidade e nome da rua para encontrar o CEP correspondente. Os dados vêm das APIs públicas ViaCEP e BrasilAPI.",
  },
  {
    q: "O que é o mapa do OpenStreetMap?",
    a: "Após encontrar um endereço, você pode visualizá-lo em um mapa interativo do OpenStreetMap, um mapa livre e colaborativo.",
  },
];

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

export const Route = createFileRoute("/meu-cep")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "meu-cep",
      "Consulta CEP: Busca por CEP ou Endereço — i-Tools",
      "Busque CEP pelo código postal ou descubra o CEP de qualquer endereço no Brasil. Dados oficiais dos Correios com mapa interativo. Grátis e sem cadastro.",
      faq,
    ),
  component: CepPage,
});

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

function CepPage() {
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

  const [copiedLocation, setCopiedLocation] = useState(false);
  const [copiedCep, setCopiedCep] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const locate = () => {
    if (!("geolocation" in navigator))
      return setLocationState({ kind: "error", msg: "Seu navegador não oferece localização." });
    setLocationState({ kind: "loading" });
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const r = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&accept-language=pt-BR&lat=${coords.latitude}&lon=${coords.longitude}`,
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
            msg: "Não foi possível consultar o endereço. Tente novamente.",
          });
        }
      },
      (err) =>
        setLocationState({
          kind: "error",
          msg:
            err.code === 1
              ? "Permissão de localização negada. Libere-a nas configurações do navegador."
              : "Não foi possível obter sua localização.",
        }),
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const searchByCEP = async () => {
    if (!cepInput.trim()) {
      setCepSearchState({ kind: "error", msg: "Digite um CEP válido." });
      return;
    }
    setCepSearchState({ kind: "loading" });
    const result = await searchAddressByCEP(cepInput);
    if (result) {
      setCepSearchState({ kind: "ok", data: result });
    } else {
      setCepSearchState({ kind: "error", msg: "CEP não encontrado." });
    }
  };

  const searchByAddress = async () => {
    if (!ufInput || !cidadeInput.trim() || !ruaInput.trim()) {
      setAddressSearchState({ kind: "error", msg: "Preencha todos os campos." });
      return;
    }
    if (ruaInput.trim().length < 3) {
      setAddressSearchState({
        kind: "error",
        msg: "O nome da rua deve ter pelo menos 3 caracteres.",
      });
      return;
    }
    setAddressSearchState({ kind: "loading" });
    const results = await searchCEPByAddress(ufInput, cidadeInput, ruaInput);
    if (results.length > 0) {
      setAddressSearchState({ kind: "ok", results });
    } else {
      setAddressSearchState({ kind: "error", msg: "Nenhum endereço encontrado." });
    }
  };

  const copyToClipboard = (text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 1500);
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
        <p className="eyebrow">Endereço encontrado</p>
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
              Ver no mapa
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    );
  };

  return (
    <ToolLayout
      slug="meu-cep"
      intro="Busque CEP pelo código postal, descubra o CEP de qualquer endereço brasileiro ou encontre seu CEP pela localização GPS."
      faq={faq}
    >
      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="location">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Minha localização</span>
            <span className="sm:hidden">Localização</span>
          </TabsTrigger>
          <TabsTrigger value="cep">
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Buscar por CEP</span>
            <span className="sm:hidden">Por CEP</span>
          </TabsTrigger>
          <TabsTrigger value="address">
            <MapIcon className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Buscar por endereço</span>
            <span className="sm:hidden">Por endereço</span>
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
                  {locationState.kind === "loading" ? "Localizando…" : "Descobrir meu CEP"}
                </button>
                {locationState.kind === "error" && (
                  <p role="alert" className="text-sm text-destructive">
                    {locationState.msg}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Dados de endereço © colaboradores do OpenStreetMap.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="cep">
          <div className={panel}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cep-input">CEP</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="cep-input"
                    placeholder="00000-000"
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
                    {cepSearchState.kind === "loading" ? "Buscando…" : "Buscar"}
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
                  <Label htmlFor="uf-input">Estado (UF)</Label>
                  <Select value={ufInput} onValueChange={setUfInput}>
                    <SelectTrigger id="uf-input" className="mt-2">
                      <SelectValue placeholder="Selecione o estado" />
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
                  <Label htmlFor="cidade-input">Cidade</Label>
                  <Input
                    id="cidade-input"
                    placeholder="Ex: São Paulo"
                    value={cidadeInput}
                    onChange={(e) => setCidadeInput(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="rua-input">Rua / Logradouro</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="rua-input"
                    placeholder="Ex: Avenida Paulista"
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
                    {addressSearchState.kind === "loading" ? "Buscando…" : "Buscar"}
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
                    {addressSearchState.results.length} resultado
                    {addressSearchState.results.length !== 1 ? "s" : ""} encontrado
                    {addressSearchState.results.length !== 1 ? "s" : ""}
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
                            {copiedAddress === result.cep ? "Copiado!" : "Copiar CEP"}
                          </button>
                          <a
                            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${result.rua}, ${result.cidade}, ${result.uf}, Brasil`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium transition-colors hover:border-foreground"
                          >
                            <MapIcon className="h-3 w-3" aria-hidden />
                            Ver no mapa
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
