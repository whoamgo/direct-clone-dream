import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, Heart, MapPin, LogOut } from "lucide-react";
import { toast } from "sonner";

const Account = () => {
  const nav = useNavigate();
  return (
    <Layout>
      <div className="container-page py-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-6">My Account</h1>
        <div className="grid md:grid-cols-[260px_1fr] gap-6">
          <aside className="bg-card border border-border rounded-lg p-4 h-fit">
            <div className="flex items-center gap-3 pb-4 border-b border-border">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">U</div>
              <div><p className="font-semibold text-sm">Hello, User</p><p className="text-xs text-muted-foreground">user@example.com</p></div>
            </div>
            <nav className="mt-4 space-y-1 text-sm">
              {[[User,"Profile","#"],[Package,"My Orders","#"],[Heart,"Wishlist","/wishlist"],[MapPin,"Addresses","#"]].map(([I,l,h], i) => {
                const Ic = I as typeof User;
                return <Link key={i} to={h as string} className="flex items-center gap-2 px-3 py-2 rounded hover:bg-muted"><Ic className="w-4 h-4" />{l as string}</Link>;
              })}
              <button onClick={() => { toast.success("Logged out (demo)"); nav("/"); }} className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-muted text-left text-destructive"><LogOut className="w-4 h-4" />Logout</button>
            </nav>
          </aside>
          <section className="bg-card border border-border rounded-lg p-6">
            <h2 className="font-bold text-lg mb-4">Recent Orders</h2>
            <div className="text-sm text-muted-foreground py-10 text-center">No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link></div>
          </section>
        </div>
      </div>
    </Layout>
  );
};
export default Account;
