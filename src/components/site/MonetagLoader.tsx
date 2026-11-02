import { useEffect } from "react";

/** Loads Monetag ad tags once, after hydration, so they never block rendering. */
export function MonetagLoader() {
  useEffect(() => {
    if (document.querySelector("script[data-monetag]")) return;

    // 1) Push (zone 12178389)
    const pushScript = document.createElement("script");
    pushScript.src = "https://5gvci.com/act/files/tag.min.js?z=12178389";
    pushScript.async = true;
    pushScript.setAttribute("data-cfasync", "false");
    pushScript.setAttribute("data-monetag", "push");
    document.body.appendChild(pushScript);

    // 2) OnClick/Popunder (zone 12178394)
    const popunderScript = document.createElement("script");
    popunderScript.setAttribute("data-monetag", "popunder");
    popunderScript.textContent = `(function(s){s.dataset.zone='12178394',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(popunderScript);

    // 3) In-Page Push (zone 12178396)
    const inPageScript = document.createElement("script");
    inPageScript.setAttribute("data-monetag", "inpage");
    inPageScript.textContent = `(function(s){s.dataset.zone='12178396',s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`;
    document.body.appendChild(inPageScript);
  }, []);
  return null;
}
