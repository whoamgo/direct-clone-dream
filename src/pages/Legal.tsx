import { Layout } from "@/components/layout/Layout";

export const makeLegal = (title: string, intro: string) => () => (
  <Layout>
    <div className="container-page py-10 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold">{title}</h1>
      <p className="text-muted-foreground mt-3">{intro}</p>
      <div className="prose prose-sm max-w-none mt-6 text-foreground/90 space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <section key={i}>
            <h2 className="font-bold text-lg mt-4">{i + 1}. Section heading</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This is placeholder content for the {title.toLowerCase()} page. Please replace with your actual policy text. We are committed to transparency, fairness, and protecting our customers' rights and data.
            </p>
          </section>
        ))}
      </div>
    </div>
  </Layout>
);

export const Privacy = makeLegal("Privacy Policy", "How we collect, use and protect your personal information.");
export const Terms = makeLegal("Terms & Conditions", "The rules and guidelines for using DirectDawai services.");
export const Returns = makeLegal("Returns & Refunds", "Our policy for product returns, refunds and exchanges.");
export const Shipping = makeLegal("Shipping Policy", "Delivery timelines, areas served, and shipping charges.");
