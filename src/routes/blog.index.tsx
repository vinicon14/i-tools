import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, pageMeta } from "@/components/site/Layout";
import {
  BLOG_CATEGORIES,
  CATEGORY_LABELS,
  type BlogCategory,
  formatBlogDate,
  listBlogPosts,
} from "@/lib/blog";

const title = "Blog do i-Tools — tecnologia, IA, automação, investimentos e ferramentas";
const description =
  "Textos em português sobre tecnologia, inteligência artificial, automação, investimentos e ferramentas online. Sem enrolação e sem promessa milagrosa.";

type BlogSearch = { categoria?: BlogCategory };

export const Route = createFileRoute("/blog/")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    const raw = typeof search["categoria"] === "string" ? search["categoria"] : "";
    return (BLOG_CATEGORIES as readonly string[]).includes(raw)
      ? { categoria: raw as BlogCategory }
      : {};
  },
  head: () => pageMeta(title, description, "/blog", "website", "pt"),
  component: BlogIndex,
});

function BlogIndex() {
  const { categoria } = Route.useSearch();
  const posts = listBlogPosts(categoria);

  return (
    <PageShell>
      <article className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <p className="eyebrow">i-Tools</p>
        <h1 className="mt-3 text-4xl sm:text-5xl">Blog</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tecnologia, inteligência artificial, automação, investimentos e ferramentas. Em português,
          com texto direto.
        </p>

        <nav aria-label="Categorias do blog" className="mt-8 flex flex-wrap gap-2">
          <CategoryLink active={!categoria} to="/blog">
            Todas
          </CategoryLink>
          {BLOG_CATEGORIES.map((slug) => (
            <CategoryLink
              key={slug}
              active={categoria === slug}
              to="/blog"
              search={{ categoria: slug }}
            >
              {CATEGORY_LABELS[slug]}
            </CategoryLink>
          ))}
        </nav>

        {posts.length === 0 ? (
          <p className="mt-12 text-muted-foreground">Ainda não há textos nesta categoria.</p>
        ) : (
          <ul className="mt-12 space-y-10">
            {posts.map((post) => (
              <li key={post.slug} className="border-t border-border pt-8">
                <p className="font-mono text-xs text-muted-foreground">
                  <time dateTime={post.date}>{formatBlogDate(post.date)}</time>
                  {" · "}
                  {CATEGORY_LABELS[post.category]}
                </p>
                <h2 className="mt-2 font-sans text-2xl font-semibold tracking-tight">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="hover:underline underline-offset-4"
                  >
                    {post.title}
                  </Link>
                </h2>
                {post.description ? (
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                    {post.description}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-16 font-mono text-xs text-muted-foreground">
          <a href="/blog/rss.xml" className="hover:text-foreground">
            RSS
          </a>
        </p>
      </article>
    </PageShell>
  );
}

function CategoryLink({
  active,
  children,
  to,
  search,
}: {
  active: boolean;
  children: string;
  to: "/blog";
  search?: BlogSearch;
}) {
  return (
    <Link
      to={to}
      search={search ?? {}}
      className={
        active
          ? "rounded-full border border-foreground bg-foreground px-3 py-1 text-xs text-background"
          : "rounded-full border border-border px-3 py-1 text-xs text-muted-foreground hover:border-foreground hover:text-foreground"
      }
    >
      {children}
    </Link>
  );
}
