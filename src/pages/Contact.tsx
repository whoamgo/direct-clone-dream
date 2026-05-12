import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";

const Contact = () => {
  useSeo("contact");
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Message sent (demo)"); };
  return (
    <Layout>
      <div className="container-page py-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center">Get in Touch</h1>
        <p className="text-center text-muted-foreground mt-2">We'd love to hear from you.</p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { I: Phone, t: "Call Us", s: "+91 5011 445 555" },
            { I: Mail, t: "Email", s: "support@directdawai.com" },
            { I: MapPin, t: "Visit", s: "New Delhi, India" },
          ].map(({ I, t, s }) => (
            <div key={t} className="bg-card border border-border rounded-lg p-5 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3"><I className="w-6 h-6" /></div>
              <h3 className="font-bold">{t}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className="mt-10 max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 sm:p-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input required /></div>
            <div><Label>Email</Label><Input required type="email" /></div>
          </div>
          <div><Label>Subject</Label><Input required /></div>
          <div><Label>Message</Label><Textarea required rows={5} /></div>
          <Button type="submit" size="lg" className="w-full">Send Message</Button>
        </form>
      </div>
    </Layout>
  );
};
export default Contact;
