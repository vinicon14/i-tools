#!/usr/bin/env node

const http = require('http');

const testUrls = [
  '/en/qr',
  '/es/qr',
  '/fr/qr',
  '/de/qr',
  '/en/baixar-video-tiktok',
  '/es/baixar-video-tiktok',
  '/fr/baixar-video-youtube',
  '/de/baixar-video-instagram',
  '/en/meu-cep',
  '/es/meu-cep',
  '/fr/meu-cep',
  '/ja/qr',
  '/ko/qr',
  '/zh/qr',
  '/ar/qr',
  '/hi/qr',
  '/id/qr',
  '/vi/qr',
  '/tr/qr',
  '/ru/qr',
  '/uk/qr',
  '/en/categorias/baixar-videos',
  '/es/categorias/arquivos',
  '/fr/categorias/imagens',
];

const PORT = 3000;

async function testUrl(url) {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}${url}`, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        const portugueseStrings = [
          'Início', 'Perguntas frequentes', 'Também em', 
          'Arquivos', 'Imagens', 'Texto', 'being localized',
          'This tool is being localized'
        ];
        
        const foundPortuguese = portugueseStrings.filter(str => data.includes(str));
        
        resolve({
          url,
          status: res.statusCode,
          hasLangAttr: data.includes('lang='),
          hasHreflang: data.includes('hreflang'),
          foundPortuguese: foundPortuguese,
          ok: res.statusCode === 200 && foundPortuguese.length === 0
        });
      });
    }).on('error', (err) => {
      resolve({
        url,
        status: 0,
        error: err.message,
        ok: false
      });
    });
  });
}

async function runTests() {
  console.log(`Testing ${testUrls.length} URLs...\n`);
  
  const results = [];
  for (const url of testUrls) {
    const result = await testUrl(url);
    results.push(result);
    
    const icon = result.ok ? '✓' : '✗';
    console.log(`${icon} ${url} - ${result.status}`);
    
    if (result.foundPortuguese && result.foundPortuguese.length > 0) {
      console.log(`  Portuguese strings found: ${result.foundPortuguese.join(', ')}`);
    }
    
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    }
  }
  
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  console.log(`${'='.repeat(50)}`);
  
  process.exit(failed > 0 ? 1 : 0);
}

runTests();
