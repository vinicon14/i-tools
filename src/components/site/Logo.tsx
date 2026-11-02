import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link
      to="/"
      className="flex items-baseline gap-0.5 text-foreground"
      aria-label="i-Tools — página inicial"
    >
      <span className="font-display text-2xl italic leading-none">i</span>
      <span className="text-primary text-2xl leading-none" aria-hidden>
        ·
      </span>
      <span className="text-lg font-semibold tracking-tight leading-none">Tools</span>
    </Link>
  );
}
