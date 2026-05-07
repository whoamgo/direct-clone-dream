import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Search, User, ChevronRight } from "lucide-react";
import { blogs } from "@/features/blog/data/blogs";

const PAGE_SIZE = 8;

const Blog = () => {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () => blogs.filter((b) => b.title.toLowerCase().includes(q.toLowerCase())),
    [q]
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const items = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> / <span>Health Resources</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Health Resources</h1>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded border text-sm font-semibold ${
                page === i + 1
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:bg-muted"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((b) => (
            <article key={b.id} className="group">
              <Link to={`/blog/${b.slug}`} className="block relative rounded-lg overflow-hidden">
                <div
                  className="aspect-[4/3] flex items-center justify-center text-4xl font-bold text-foreground/30"
                  style={{ background: b.cover }}
                >
                  💊
                </div>
                <div className="absolute top-3 left-3 bg-background/90 rounded px-2 py-1 text-center leading-tight">
                  <div className="text-xl font-extrabold text-foreground">{b.day}</div>
                  <div className="text-[10px] uppercase text-muted-foreground">{b.month}</div>
                </div>
              </Link>
              <h3 className="mt-4 font-bold text-foreground group-hover:text-primary line-clamp-2">
                <Link to={`/blog/${b.slug}`}>{b.title}</Link>
              </h3>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground border-b border-border pb-2">
                <User className="w-3 h-3" /> Post by {b.author}
              </div>
              <Link
                to={`/blog/${b.slug}`}
                className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-primary"
              >
                <ChevronRight className="w-3 h-3" /> Read More
              </Link>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-12">No articles found.</p>
        )}
      </div>
    </Layout>
  );
};

export default Blog;