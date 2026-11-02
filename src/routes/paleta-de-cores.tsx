import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Download, LockKeyhole, Shuffle, UnlockKeyhole } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/site/CopyButton';
import { ToolLayout, toolHead } from '@/components/site/ToolLayout';
import { hexToRgb, makePalette, randomColor, type PaletteMode } from '@/lib/palette-tools';
import { saveBlob } from '@/lib/image-tools';
export const Route = createFileRoute('/paleta-de-cores')({
  staticData: { sitemap: true },
  head: () => toolHead('paleta-de-cores', 'Gerador de paletas de cores HEX e RGB — i-Tools', 'Crie paletas análogas, complementares e monocromáticas, copie códigos HEX e RGB e salve suas combinações. Grátis e sem cadastro.'),
  component: PalettePage,
});
function PalettePage() {
  const [base, setBase] = useState('#FF5A1F'); const [mode, setMode] = useState<PaletteMode>('analogous'); const [colors, setColors] = useState(() => makePalette('#FF5A1F', 'analogous')); const [locks, setLocks] = useState<boolean[]>([false, false, false, false, false]); const [error, setError] = useState('');
  function generate(color: string, nextMode = mode) { try { const next = makePalette(color, nextMode); setColors(prev => next.map((v, i) => locks[i] ? (prev[i] ?? v) : v)); setError(''); } catch (e) { setError(e instanceof Error ? e.message : 'Cor inválida.'); } }
  return <ToolLayout slug="paleta-de-cores" intro="Encontre cinco cores que combinam com sua próxima ideia." faq={[
    { q: 'Como são criadas as paletas?', a: 'As combinações usam matizes próximos, complementares ou variações de luminosidade de uma cor base. Bloqueie as cores que deseja manter antes de gerar outra combinação.' },
    { q: 'O que são HEX e RGB?', a: 'HEX representa uma cor com seis dígitos hexadecimais. RGB usa valores de vermelho, verde e azul entre 0 e 255. Os dois códigos podem representar a mesma cor.' },
    { q: 'Uma paleta garante acessibilidade?', a: 'Não. Verifique o contraste entre texto e fundo no seu projeto. Uma combinação harmoniosa não garante legibilidade.' },
  ]}><div className="max-w-5xl">
    <div className="flex flex-wrap items-end gap-4"><div><label htmlFor="palette-base" className="block text-sm font-semibold">Cor base</label><div className="mt-2 flex items-center gap-2"><input type="color" aria-label="Escolher cor base" value={/^#[\da-f]{6}$/i.test(base) ? base : '#FF5A1F'} onChange={e => { setBase(e.target.value.toUpperCase()); generate(e.target.value); }} className="h-11 w-12 cursor-pointer rounded-md border border-input bg-background" /><input id="palette-base" value={base} maxLength={7} onChange={e => setBase(e.target.value)} onBlur={() => generate(base)} className="h-11 w-32 rounded-md border border-input bg-background px-3 font-mono" /></div></div><div><label htmlFor="palette-mode" className="block text-sm font-semibold">Harmonia</label><select id="palette-mode" value={mode} onChange={e => { const next = e.target.value as PaletteMode; setMode(next); generate(base, next); }} className="mt-2 h-11 rounded-md border border-input bg-background px-3"><option value="analogous">Análoga</option><option value="complementary">Complementar</option><option value="monochrome">Monocromática</option></select></div><Button onClick={() => { const color = randomColor(); setBase(color); generate(color); }}><Shuffle aria-hidden />Gerar paleta</Button><Button variant="outline" onClick={() => saveBlob(new Blob([JSON.stringify(colors.map(hex => ({ hex, rgb: hexToRgb(hex) })), null, 2)], { type: 'application/json' }), 'paleta.json')}><Download aria-hidden />Salvar</Button></div>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <div className="mt-8 grid gap-4 sm:grid-cols-5">{colors.map((hex, i) => { const rgb = hexToRgb(hex); return <article key={i} className="min-w-0 overflow-hidden rounded-md border border-border bg-card"><div className="h-28 sm:h-48" style={{ backgroundColor: hex }} aria-label={`Cor ${hex}`} /><div className="p-3"><div className="flex items-center justify-between gap-1"><span className="font-mono text-sm">{hex}</span><Button variant="ghost" size="icon" className="shrink-0" aria-label={`${locks[i] ? 'Desbloquear' : 'Bloquear'} cor ${i + 1}`} title={locks[i] ? 'Desbloquear cor' : 'Bloquear cor'} aria-pressed={locks[i]} onClick={() => setLocks(prev => prev.map((v, index) => index === i ? !v : v))}>{locks[i] ? <LockKeyhole aria-hidden /> : <UnlockKeyhole aria-hidden />}</Button></div><p className="mb-3 break-words font-mono text-xs text-muted-foreground">RGB {rgb.r}, {rgb.g}, {rgb.b}</p><div className="flex flex-wrap gap-2"><CopyButton value={hex} label="HEX" /><CopyButton value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} label="RGB" /></div></div></article>; })}</div>
  </div></ToolLayout>;
}
