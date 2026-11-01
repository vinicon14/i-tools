import { useEffect } from "react";
import { MONETAG, adsEnabled } from "@/lib/ads";

/** Loads the Monetag tag once, after hydration, so it never blocks rendering. */
export function MonetagLoader() {
  useEffect(() => {
    if (!adsEnabled() || document.querySelector("script[data-monetag]")) return;
    const s = document.createElement("script");
    s.src = MONETAG.scriptSrc;
    s.async = true;
    s.dataset.zone = MONETAG.zoneId;
    s.dataset.monetag = "true";
    s.setAttribute("data-cfasync", "false");
    document.body.appendChild(s);
  }, []);
  return null;
}
