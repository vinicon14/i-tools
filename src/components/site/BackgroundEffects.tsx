import { useEffect, useRef } from "react";

/**
 * Fundo decorativo do site (mobile-first):
 * 1. Grade animada que cobre a tela inteira.
 * 2. Blobs de gradiente que flutuam lentamente.
 * 3. Holofote suave que segue o mouse (apenas em dispositivos com ponteiro).
 */
export function BackgroundEffects() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canHover || reduce) return;

    let raf = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let targetX = x;
    let targetY = y;

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (glowRef.current) glowRef.current.style.opacity = "1";
    };

    const loop = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x - 320}px, ${y - 320}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
      aria-hidden
    >
      {/* Grade animada full-screen */}
      <div className="absolute inset-0 bg-grid animate-grid-drift opacity-70" />

      {/* Blobs de gradiente que se movem */}
      <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-3xl animate-blob" />
      <div
        className="absolute -bottom-40 -right-40 h-[36rem] w-[36rem] rounded-full bg-accent/10 blur-3xl animate-blob"
        style={{ animationDelay: "-10s" }}
      />

      {/* Holofote que segue o mouse */}
      <div
        ref={glowRef}
        className="absolute left-0 top-0 h-[640px] w-[640px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--color-primary) 14%, transparent), transparent 65%)",
        }}
      />
    </div>
  );
}
