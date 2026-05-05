import { Layout } from "@/components/layout/Layout";
import { AccountSidebar } from "@/components/layout/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Home, ChevronRight, LogOut } from "lucide-react";
import { toast } from "sonner";

const tabTitles: Record<string, string> = {
  orders: "Order History", addresses: "Addresses", downloads: "Downloads",
  recurring: "Recurring Payments", coins: "My Coins", returns: "Returns",
  transactions: "Transactions", newsletter: "Newsletter Subscription",
};

const Account = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const tab = params.get("tab");
  const title = tab ? tabTitles[tab] ?? "My Account" : "Account Dashboard";

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">My Account</span>
        </nav>
        <div className="grid lg:grid-cols-[1fr_18rem] gap-5">
          <section className="space-y-5">
            <div className="bg-card border border-border rounded-lg p-5 sm:p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl">U</div>
              <div className="flex-1">
                <p className="font-bold text-lg">Hello, User</p>
                <p className="text-xs text-muted-foreground">user@directdawai.com</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => { toast.success("Logged out (demo)"); nav("/"); }}>
                <LogOut className="w-4 h-4 mr-1.5" /> Logout
              </Button>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h1 className="text-xl font-extrabold mb-4">{title}</h1>
              {tab === "addresses" ? (
                <div className="text-sm text-muted-foreground py-10 text-center">No saved addresses yet.</div>
              ) : tab === "orders" || !tab ? (
                <div className="text-sm text-muted-foreground py-10 text-center">
                  No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground py-10 text-center">No data to display.</div>
              )}
            </div>
          </section>
          <AccountSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Account;
