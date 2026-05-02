import { Layout } from "@/components/layout/Layout";
import { Heart, ShieldCheck, Users, Award } from "lucide-react";

const About = () => (
  <Layout>
    <div className="bg-gradient-banner">
      <div className="container-page py-14 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold">About DirectDawai</h1>
        <p className="mt-3 max-w-2xl mx-auto text-foreground/80">Your trusted partner in health and wellness, delivering authentic medicines and care essentials to your doorstep.</p>
      </div>
    </div>
    <div className="container-page py-12 grid md:grid-cols-2 gap-10 items-center">
      <div className="aspect-video rounded-xl bg-gradient-hero flex items-center justify-center text-9xl">💊</div>
      <div>
        <h2 className="text-2xl font-bold mb-3">Our Story</h2>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">Founded with a simple mission — make quality healthcare accessible to every household in India. We curate genuine medicines, vitamins, ayurveda and daily essentials from trusted brands.</p>
        <p className="text-muted-foreground text-sm leading-relaxed">Every product is verified, every order is fulfilled with care, and our customer support team is here for you 7 days a week.</p>
      </div>
    </div>
    <div className="container-page pb-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { I: ShieldCheck, t: "100% Authentic", s: "Every product is sourced from verified suppliers." },
        { I: Heart, t: "Customer First", s: "Your wellness is our top priority." },
        { I: Users, t: "10K+ Customers", s: "Trusted by families across India." },
        { I: Award, t: "Award-Winning", s: "Recognized for service excellence." },
      ].map(({ I, t, s }) => (
        <div key={t} className="bg-card border border-border rounded-lg p-5 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3"><I className="w-6 h-6" /></div>
          <h3 className="font-bold">{t}</h3>
          <p className="text-xs text-muted-foreground mt-1">{s}</p>
        </div>
      ))}
    </div>
  </Layout>
);
export default About;
