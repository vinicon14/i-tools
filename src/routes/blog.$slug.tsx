import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, pageMeta } from "@/components/site/Layout";
import {
  CATEGORY_LABELS,
  INVESTMENT_DISCLAIMER,
  formatBlogDate,
  getBlogPost,
} from "@/lib/blog";

export const Route = createFileRoute("/blog/$slug")({
  staticData: { sitemap: false },
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { slug: post.slug };
  },
  head: ({ loaderData }) => {
    const post = loaderData && getBlogPost(loaderData.slug);
    if (!post) {
      return {
        meta: [{ title: "Texto não encontrado — i-Tools" }, { name: "robots", content: "noindex" }],
      };
    }
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      inLanguage: "pt-BR",
      url: `https://i-tools.shop${post.path}`,
      isPartOf: { "@type": "Blog", name: "Blog do i-Tools", url: "https://i-tools.shop/blog" },
      publisher: { "@type": "Organization", name: "i-Tools", url: "https://i-tools.shop" },
    };
    return {
      ...pageMeta(post.title, post.description || post.title, post.path, "article", "pt"),
      scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-4xl font-bold">Texto não encontrado</p>
        <Link
          to="/blog"
          className="mt-6 inline-block font-medium underline decoration-primary underline-offset-4"
        >
          Voltar ao blog
        </Link>
      </div>
    </PageShell>
  ),
});

function BlogPostPage() {
  const { slug } = Route.useLoaderData();
  const post = getBlogPost(slug);
  if (!post) return null;
  const showDisclaimer = post.category === "investimentos";

  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <nav aria-label="Trilha de navegação" className="font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>
          {" / "}
          <Link to="/blog" className="hover:text-foreground">
            Blog
          </Link>
          {" / "}
          <span>{CATEGORY_LABELS[post.category]}</span>
        </nav>
        <p className="mt-8 font-mono text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
          {" · "}
          {CATEGORY_LABELS[post.category]}
        </p>
        <h1 className="mt-3 text-4xl sm:text-5xl">{post.title}</h1>
        {post.description ? (
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
        ) : null}
        {showDisclaimer ? (
          <aside className="blog-disclaimer mt-8" role="note">
            {INVESTMENT_DISCLAIMER}
          </aside>
        ) : null}
        <div
          className="blog-body mt-10"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
        {post.tags.length > 0 ? (
          <ul className="mt-12 flex flex-wrap gap-2 font-mono text-xs text-muted-foreground">
            {post.tags.map((tag) => (
              <li key={tag}>#{tag}</li>
            ))}
          </ul>
        ) : null}
        <p className="mt-16 border-t border-border pt-8 text-sm text-muted-foreground">
          <Link to="/blog" className="hover:text-foreground">
            ← Todos os textos
          </Link>
        </p>
      </article>
    </PageShell>
  );
}
