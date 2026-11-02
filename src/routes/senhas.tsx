import { createFileRoute } from "@tanstack/react-router";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/site/CopyButton";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import { generatePassword, type PasswordGroup } from "@/lib/everyday-tools";

export const Route = createFileRoute("/senhas")({
  staticData: { sitemap: true },
  head: () => toolHead("senhas", "Gerador de senhas fortes grátis — i-Tools", "Gere senhas aleatórias de 8 a 128 caracteres com letras, números e símbolos. Grátis, sem cadastro e sem enviar sua senha."),
  component: PasswordPage,
});
const options: { key: PasswordGroup; label: string }[] = [
  { key: "lowercase", label: "Minúsculas (a–z)" }, { key: "uppercase", label: "Maiúsculas (A–Z)" },
  { key: "numbers", label: "Números (0–9)" }, { key: "symbols", label: "Símbolos (!@#)" },
];
function PasswordPage() {
  const [length, setLength] = useState(20);
  const [groups, setGroups] = useState<PasswordGroup[]>(options.map((o) => o.key));
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  function generate() { try { setPassword(generatePassword(length, groups)); setError(""); } catch (e) { setError(e instanceof Error ? e.message : "Não foi possível gerar a senha."); } }
  return <ToolLayout slug="senhas" intro="Uma senha diferente para cada conta. Gerada somente no seu aparelho." faq={[
    { q: "As senhas são armazenadas?", a: "Não. A geração usa a aleatoriedade criptográfica do navegador e não envia nem salva a senha no i-Tools." },
    { q: "Qual tamanho escolher?", a: "Prefira senhas longas e únicas. O padrão é 20 caracteres; ajuste às regras do serviço onde vai usar." },
    { q: "Posso recuperar uma senha depois?", a: "Não. Guarde a senha em um gerenciador de senhas antes de sair desta página." },
  ]}>
    <div className={`${panel} max-w-3xl space-y-6`}>
      <div><label htmlFor="password-output" className="text-sm font-semibold">Sua senha</label>
        <input id="password-output" readOnly value={password} placeholder="Sua nova senha" autoComplete="off" spellCheck={false} className="mt-2 h-16 w-full rounded-md border border-input bg-background px-4 font-mono text-lg" />
      </div>
      <div className="flex flex-wrap items-center gap-4"><label htmlFor="password-length" className="text-sm font-semibold">Caracteres</label>
        <input id="password-length" type="number" min={8} max={128} value={Number.isNaN(length) ? "" : length} onChange={(e) => { setLength(e.target.valueAsNumber); setPassword(""); }} className="h-11 w-24 rounded-md border border-input bg-background px-3" />
      </div>
      <fieldset><legend className="mb-3 text-sm font-semibold">Incluir</legend><div className="grid gap-4 sm:grid-cols-2">
        {options.map((o) => <label key={o.key} className="flex items-center gap-3 text-sm"><input type="checkbox" checked={groups.includes(o.key)} onChange={(e) => { setGroups(e.target.checked ? [...groups, o.key] : groups.filter((g) => g !== o.key)); setPassword(""); }} className="h-4 w-4 accent-primary" />{o.label}</label>)}
      </div></fieldset>
      <div className="flex flex-wrap gap-3"><Button onClick={generate}><RefreshCw aria-hidden />Gerar senha</Button><CopyButton key={password} value={password} /></div>
      <p role="alert" className="min-h-5 text-sm text-destructive">{error}</p>
    </div>
  </ToolLayout>;
}