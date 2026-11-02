import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Flag, Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import {
  countdownDuration,
  elapsedTime,
  formatTime,
  pomodoroDuration,
  remainingTime,
  type TimerMode,
} from "@/lib/timer-tools";
export const Route = createFileRoute("/cronometro")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "cronometro",
      "Cronômetro, timer e pomodoro online grátis — i-Tools",
      "Use cronômetro com voltas, timer com contagem regressiva e pomodoro de 25 minutos com pausa de 5 minutos. Grátis e sem cadastro.",
    ),
  component: TimerPage,
});
function TimerPage() {
  const [mode, setMode] = useState<TimerMode>("stopwatch");
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [duration, setDuration] = useState(300000);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState("");
  const started = useRef<number | null>(null);
  const accumulated = useRef(0);
  useEffect(() => {
    if (!running) return;
    const update = () => {
      const current = elapsedTime(accumulated.current, started.current, Date.now());
      if (mode !== "stopwatch" && current >= duration) {
        accumulated.current = duration;
        started.current = null;
        setElapsed(duration);
        setRunning(false);
        setFinished(true);
      } else setElapsed(current);
    };
    update();
    const id = window.setInterval(update, 50);
    return () => window.clearInterval(id);
  }, [running, mode, duration]);
  function reset() {
    started.current = null;
    accumulated.current = 0;
    setElapsed(0);
    setRunning(false);
    setFinished(false);
    setLaps([]);
    setError("");
  }
  function start() {
    try {
      if (finished) {
        accumulated.current = 0;
        setElapsed(0);
      }
      if (accumulated.current === 0 && mode !== "stopwatch")
        setDuration(
          mode === "pomodoro" ? pomodoroDuration(phase) : countdownDuration(minutes, seconds),
        );
      started.current = Date.now();
      setRunning(true);
      setFinished(false);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Confira o tempo.");
    }
  }
  function pause() {
    const current = elapsedTime(accumulated.current, started.current, Date.now());
    accumulated.current = mode === "stopwatch" ? current : Math.min(duration, current);
    started.current = null;
    setElapsed(accumulated.current);
    setRunning(false);
  }
  const configured =
    mode === "pomodoro" ? pomodoroDuration(phase) : Math.max(0, (minutes * 60 + seconds) * 1000);
  const display =
    mode === "stopwatch"
      ? elapsed
      : remainingTime(elapsed === 0 && !running ? configured : duration, elapsed);
  return (
    <ToolLayout
      slug="cronometro"
      intro="Seu tempo, no ritmo certo: cronômetro, contagem regressiva e foco."
      faq={[
        {
          q: "Como funciona o pomodoro?",
          a: "O período de foco dura 25 minutos e a pausa dura 5 minutos. Ao terminar, selecione o próximo período e inicie quando estiver pronto.",
        },
        {
          q: "O timer continua em outra aba?",
          a: "O tempo é calculado por horário, corrigindo atrasos de atualização. Navegadores podem suspender abas; a tela é atualizada ao retomar. Ao fechar ou recarregar a página, a contagem é perdida.",
        },
        {
          q: "Como vejo quando o tempo acaba?",
          a: "O timer para no zero e exibe Tempo encerrado. Não há notificação sonora nem aviso fora desta página.",
        },
      ]}
    >
      <div className={`${panel} max-w-3xl`}>
        <label htmlFor="timer-mode" className="text-sm font-semibold">
          Modo
        </label>
        <select
          id="timer-mode"
          value={mode}
          onChange={(e) => {
            reset();
            setMode(e.target.value as TimerMode);
          }}
          className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3"
        >
          <option value="stopwatch">Cronômetro</option>
          <option value="countdown">Contagem regressiva</option>
          <option value="pomodoro">Pomodoro</option>
        </select>
        {mode === "countdown" && (
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="timer-minutes" className="text-sm">
                Minutos
              </label>
              <input
                id="timer-minutes"
                type="number"
                min="0"
                max="1440"
                disabled={running || elapsed > 0}
                value={minutes}
                onChange={(e) => setMinutes(Number(e.target.value))}
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
              />
            </div>
            <div>
              <label htmlFor="timer-seconds" className="text-sm">
                Segundos
              </label>
              <input
                id="timer-seconds"
                type="number"
                min="0"
                max="59"
                disabled={running || elapsed > 0}
                value={seconds}
                onChange={(e) => setSeconds(Number(e.target.value))}
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
              />
            </div>
          </div>
        )}
        {mode === "pomodoro" && (
          <div className="mt-5 flex gap-3">
            <Button
              variant={phase === "focus" ? "default" : "outline"}
              onClick={() => {
                reset();
                setPhase("focus");
              }}
            >
              Foco · 25 min
            </Button>
            <Button
              variant={phase === "break" ? "default" : "outline"}
              onClick={() => {
                reset();
                setPhase("break");
              }}
            >
              Pausa · 5 min
            </Button>
          </div>
        )}
        <div className="py-10 text-center">
          <output aria-label="Tempo" className="block font-mono text-4xl tabular-nums sm:text-6xl">
            {formatTime(display)}
          </output>
          {mode === "stopwatch" && (
            <span className="mt-2 block font-mono text-sm text-muted-foreground">
              .{String(Math.floor((elapsed % 1000) / 10)).padStart(2, "0")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={running ? pause : start}>
            {running ? <Pause aria-hidden /> : <Play aria-hidden />}
            {running ? "Pausar" : elapsed > 0 && !finished ? "Continuar" : "Iniciar"}
          </Button>
          <Button variant="outline" onClick={reset}>
            <RotateCcw aria-hidden />
            Zerar
          </Button>
          {mode === "stopwatch" && (
            <Button
              variant="outline"
              disabled={!running || laps.length >= 100}
              onClick={() =>
                setLaps((prev) => [
                  ...prev,
                  elapsedTime(accumulated.current, started.current, Date.now()),
                ])
              }
            >
              <Flag aria-hidden />
              Volta
            </Button>
          )}
        </div>
        <div aria-live="polite" className="mt-5 text-center">
          {finished && (
            <p role="status" className="font-semibold text-accent">
              Tempo encerrado.
            </p>
          )}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
        </div>
        {laps.length > 0 && (
          <ol
            aria-label="Voltas"
            className="mt-6 max-h-72 overflow-auto divide-y divide-border border-t border-border"
          >
            {laps.map((lap, i) => (
              <li key={i} className="flex justify-between gap-3 py-3 font-mono text-sm">
                <span>Volta {i + 1}</span>
                <span>
                  {formatTime(lap)}.{String(Math.floor((lap % 1000) / 10)).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </ToolLayout>
  );
}
