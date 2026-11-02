/**
 * Monetag configuration. Paste the values from your Monetag dashboard
 * (Sites > your site > Get code). Leave empty to keep ads off.
 * Only non-intrusive formats are used (In-Page Push / banner style tag).
 * Popunders and redirect formats are intentionally not supported.
 */
export const MONETAG = {
  /** Script src from the Monetag tag, e.g. "https://<domain>/<path>/tag.min.js" */
  scriptSrc: "",
  /** data-zone value from the Monetag tag */
  zoneId: "",
};

export const adsEnabled = () => Boolean(MONETAG.scriptSrc && MONETAG.zoneId);
