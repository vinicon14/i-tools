const { tools, categories } = require('./src/lib/catalog.ts');

const LANGUAGES = 18; // 17 + default
const staticPages = ['/', '/sobre', '/contato', '/privacidade', '/termos']; // exemplo estimado
const toolPages = tools.length;
const categoryPages = categories.length;

const totalPages = staticPages.length + toolPages + categoryPages;
const totalURLs = totalPages * LANGUAGES;

console.log('Páginas estáticas:', staticPages.length);
console.log('Páginas de ferramentas:', toolPages);
console.log('Páginas de categorias:', categoryPages);
console.log('Total de páginas base:', totalPages);
console.log('Total de idiomas:', LANGUAGES);
console.log('Total de URLs no sitemap:', totalURLs);
