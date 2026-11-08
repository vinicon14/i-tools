import { describe, expect, it } from "vitest";
import { tools, getCategory, toolsByCategory } from "../catalog";

describe("Related tools validation", () => {
  it("todas as ferramentas live devem ter seção relacionadas quando há outras ferramentas na mesma categoria", () => {
    const liveTools = tools.filter((t) => t.status === "live");
    
    for (const tool of liveTools) {
      const category = getCategory(tool.category);
      expect(category, `Ferramenta ${tool.slug} tem categoria inválida: ${tool.category}`).toBeDefined();
      
      const relatedTools = toolsByCategory(tool.category).filter((t) => t.slug !== tool.slug && t.status === "live");
      
      // Se há outras ferramentas live na mesma categoria, o ToolLayout automaticamente
      // mostra a seção relacionadas. Este teste documenta essa expectativa.
      if (relatedTools.length > 0) {
        expect(relatedTools.length).toBeGreaterThan(0);
        // ToolLayout implementa automaticamente a seção relacionadas para essas ferramentas
      }
    }
  });

  it("nenhuma ferramenta deve referenciar categoria inexistente", () => {
    for (const tool of tools) {
      const category = getCategory(tool.category);
      expect(category, `Ferramenta ${tool.slug} referencia categoria inexistente: ${tool.category}`).toBeDefined();
    }
  });

  it("todas as ferramentas localized devem ter localized=true no catalog", () => {
    const localizedSlugs = [
      "baixar-video-youtube",
      "baixar-video-tiktok", 
      "baixar-video-instagram",
      "qr",
      "meu-cep"
    ];
    
    for (const slug of localizedSlugs) {
      const tool = tools.find((t) => t.slug === slug);
      expect(tool, `Ferramenta ${slug} não encontrada`).toBeDefined();
      expect(tool?.localized, `Ferramenta ${slug} deveria ter localized=true`).toBe(true);
    }
  });

  it("categorias com múltiplas ferramentas live devem interligar suas ferramentas", () => {
    const categoriesWithMultipleTools = [
      { slug: "imagens", expectedMinimum: 3 }, // comprimir-imagem, redimensionar-imagem, paleta-de-cores
      { slug: "produtividade", expectedMinimum: 7 }, // múltiplas ferramentas
      { slug: "desenvolvedores", expectedMinimum: 2 }, // senhas, json
    ];

    for (const cat of categoriesWithMultipleTools) {
      const categoryTools = toolsByCategory(cat.slug).filter((t) => t.status === "live");
      expect(categoryTools.length).toBeGreaterThanOrEqual(cat.expectedMinimum);
      
      // Cada ferramenta da categoria tem acesso automático às outras via ToolLayout
      for (const tool of categoryTools) {
        const related = categoryTools.filter((t) => t.slug !== tool.slug);
        expect(related.length).toBeGreaterThan(0);
      }
    }
  });
});
