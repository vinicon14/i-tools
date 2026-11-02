export type TimerMode = 'stopwatch' | 'countdown' | 'pomodoro';
export function elapsedTime(accumulated: number, startedAt: number | null, now: number) { return accumulated + (startedAt === null ? 0 : Math.max(0, now - startedAt)); }
export function remainingTime(duration: number, elapsed: number) { return Math.max(0, duration - elapsed); }
export function formatTime(ms: number) { const seconds = Math.floor(Math.max(0, ms) / 1000); return [Math.floor(seconds / 3600), Math.floor(seconds / 60) % 60, seconds % 60].map(n => String(n).padStart(2, '0')).join(':'); }
export function countdownDuration(minutes: number, seconds: number) { if (!Number.isInteger(minutes) || !Number.isInteger(seconds) || minutes < 0 || minutes > 1440 || seconds < 0 || seconds > 59 || minutes * 60 + seconds === 0) throw new Error('Defina de 1 segundo até 24 horas, com segundos entre 0 e 59.'); return (minutes * 60 + seconds) * 1000; }
export const pomodoroDuration = (phase: 'focus' | 'break') => (phase === 'focus' ? 25 : 5) * 60 * 1000;
