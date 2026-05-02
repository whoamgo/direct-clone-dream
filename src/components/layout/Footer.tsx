import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const cols = [
  { title: "Quick Links", links: [["About Us","/about"],["Contact Us","/contact"],["FAQ","/faq"],["Shop","/shop"]] as const },
  { title: "Policies", links: [["Privacy Policy","/privacy"],["Terms & Conditions","/terms"],["Returns & Refunds","/returns"],["Shipping Policy","/shipping"]] as const },
  { title: "My Account", links: [["Login","/login"],["Register","/register"],["My Orders","/account"],["Wishlist","/wishlist"]] as const },
];

export const Footer = () => (
  <footer className="bg-topbar mt-12 border-t border-border">
    <div className="container-page py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
      <div className="col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-promo flex items-center justify-center text-primary-foreground font-extrabold">D+</div>
          <div className="leading-tight">
            <div className="font-extrabold text-lg">DIRECT</div>
            <div className="text-[10px] font-bold text-secondary -mt-1">DAWAI</div>
          </div>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">
          Your trusted online pharmacy. Authentic medicines, vitamins, ayurveda, and healthcare essentials delivered to your doorstep.
        </p>
        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary" /> +91 5011445555</div>
          <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> support@directdawai.com</div>
          <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> New Delhi, India</div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          {[Facebook, Instagram, Twitter, Youtube].map((I, i) => (
            <a key={i} href="#" className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition">
              <I className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
      {cols.map((c) => (
        <div key={c.title}>
          <h4 className="font-bold mb-3 text-sm">{c.title}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            {c.links.map(([l, h]) => (
              <li key={h}><Link to={h} className="hover:text-primary">{l}</Link></li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border">
      <div className="container-page py-4 text-xs text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
        <p>© {new Date().getFullYear()} DirectDawai Clone. All rights reserved.</p>
        <p>Built for demo purposes.</p>
      </div>
    </div>
  </footer>
);
