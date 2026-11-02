const baseUrl = "http://localhost:3000";

const testUrls = [
  // Home pages
  "/",
  "/en",
  "/es",
  "/fr",
  "/de",
  "/ja",
  "/ko",
  "/zh",
  "/ar",
  
  // Category pages
  "/en/categorias/imagens",
  "/es/categorias/produtividade",
  "/fr/categorias/arquivos",
  
  // Tool pages - CEP
  "/en/meu-cep",
  "/es/meu-cep",
  "/fr/meu-cep",
  "/de/meu-cep",
  
  // Tool pages - Video downloaders
  "/en/baixar-video-tiktok",
  "/es/baixar-video-youtube",
  "/fr/baixar-video-instagram",
  
  // Tool pages - Other tools
  "/en/qr",
  "/es/senhas",
  "/de/pdf",
  "/ja/json",
  "/ko/contador-de-palavras",
  
  // Test invalid language (should 404)
  "/xx",
  "/xx/qr",
];

async function testUrl(url) {
  try {
    const response = await fetch(baseUrl + url);
    const text = await response.text();
    
    // Extract lang attribute
    const langMatch = text.match(/<html[^>]*lang="([^"]+)"/);
    const lang = langMatch ? langMatch[1] : null;
    
    // Extract dir attribute
    const dirMatch = text.match(/<html[^>]*dir="([^"]+)"/);
    const dir = dirMatch ? dirMatch[1] : null;
    
    // Check for hreflang tags
    const hreflangCount = (text.match(/hreflang=/g) || []).length;
    
    // Check for translated content (look for H1)
    const h1Match = text.match(/<h1[^>]*>([^<]+)</);
    const h1 = h1Match ? h1Match[1] : null;
    
    return {
      url,
      status: response.status,
      ok: response.ok,
      lang,
      dir,
      hreflangCount,
      h1: h1 ? h1.substring(0, 50) : null,
    };
  } catch (error) {
    return {
      url,
      status: "ERROR",
      ok: false,
      error: error.message,
    };
  }
}

async function runTests() {
  console.log(`Testing ${testUrls.length} localized URLs...\n`);
  
  const results = [];
  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
    
    const statusIcon = result.ok ? "✓" : "✗";
    const statusColor = result.ok ? "\x1b[32m" : "\x1b[31m";
    const resetColor = "\x1b[0m";
    
    console.log(`${statusColor}${statusIcon}${resetColor} ${result.status} ${result.url}`);
    if (result.lang) console.log(`   lang="${result.lang}" dir="${result.dir || "ltr"}" hreflang=${result.hreflangCount}`);
    if (result.h1) console.log(`   H1: ${result.h1}`);
    if (result.error) console.log(`   ERROR: ${result.error}`);
    console.log();
  }
  
  // Summary
  const okCount = results.filter(r => r.ok).length;
  const errorCount = results.filter(r => !r.ok).length;
  
  console.log("\n" + "=".repeat(60));
  console.log(`SUMMARY: ${okCount}/${testUrls.length} URLs returned 200`);
  console.log(`Failed: ${errorCount}`);
  console.log("=".repeat(60));
  
  // Check specific requirements
  console.log("\nValidation Checks:");
  
  const withLang = results.filter(r => r.ok && r.lang).length;
  console.log(`✓ URLs with lang attribute: ${withLang}/${okCount}`);
  
  const withHreflang = results.filter(r => r.ok && r.hreflangCount > 0).length;
  console.log(`✓ URLs with hreflang tags: ${withHreflang}/${okCount}`);
  
  const withTranslatedH1 = results.filter(r => r.ok && r.h1).length;
  console.log(`✓ URLs with H1: ${withTranslatedH1}/${okCount}`);
  
  const arPages = results.filter(r => r.lang === "ar");
  if (arPages.length > 0) {
    const arWithRtl = arPages.filter(r => r.dir === "rtl").length;
    console.log(`✓ Arabic pages with dir="rtl": ${arWithRtl}/${arPages.length}`);
  }
  
  process.exit(errorCount > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error("Test script failed:", err);
  process.exit(1);
});
