import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { bySlug, blogs } from "@/data/blogs";
import { Calendar, User } from "lucide-react";

const renderLine = (line: string, i: number) => {
  if (line.startsWith("## ")) {
    return <h2 key={i} className="text-xl md:text-2xl font-bold text-primary mt-6 mb-3">{line.replace("## ", "")}</h2>;
  }
  if (line.startsWith("- ")) {
    return (
      <ul key={i} className="list-disc pl-6 space-y-1 my-3 text-foreground/80">
        {line.split("\n").map((l, j) => <li key={j}>{l.replace("- ", "")}</li>)}
      </ul>
    );
  }
  return <p key={i} className="text-foreground/80 leading-relaxed my-3">{line}</p>;
};

const BlogDetails = () => {
  const { slug } = useParams();
  const blog = bySlug(slug || "");
  if (!blog) {
    return (
      <Layout>
        <div className="container-page py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Article not found</h1>
          <Link to="/blog" className="text-primary">Back to Health Resources</Link>
        </div>
      </Layout>
    );
  }

  const related = blogs.filter((b) => b.slug !== blog.slug).slice(0, 4);

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="text-xs text-muted-foreground mb-4">
          <Link to="/" className="hover:text-primary">Home</Link> /{" "}
          <Link to="/blog" className="hover:text-primary">Health Resources</Link> /{" "}
          <span className="text-foreground">{blog.title}</span>
        </nav>

        <article className="max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-extrabold text-foreground mb-3">{blog.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground border-b border-border pb-4 mb-6">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> Posted by {blog.author}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Created Date {blog.date}</span>
          </div>

          <div className="float-none md:float-left md:mr-6 md:mb-4 w-full md:w-1/2 rounded-lg overflow-hidden mb-4">
            <div
              className="aspect-[4/3] flex items-center justify-center text-6xl text-foreground/30"
              style={{ background: blog.cover }}
            >
              💊
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {blog.content.map(renderLine)}
          </div>
        </article>

        <section className="mt-16 pt-8 border-t border-border">
          <h2 className="text-xl font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((b) => (
              <Link key={b.id} to={`/blog/${b.slug}`} className="group">
                <div
                  className="aspect-[4/3] rounded-lg flex items-center justify-center text-3xl text-foreground/30"
                  style={{ background: b.cover }}
                >
                  💊
                </div>
                <h3 className="mt-3 text-sm font-semibold group-hover:text-primary line-clamp-2">{b.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BlogDetails;