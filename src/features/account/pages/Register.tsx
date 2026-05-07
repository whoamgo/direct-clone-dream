import { Link, useNavigate } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Register = () => {
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Account created (demo)"); nav("/account"); };
  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/account" className="hover:text-primary">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Register</span>
        </nav>
        <div className="grid lg:grid-cols-[1fr_18rem] gap-5">
        <div className="w-full bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-center">Create Account</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Join DirectDawai for personalized care</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>First Name</Label><Input required /></div>
              <div><Label>Last Name</Label><Input required /></div>
            </div>
            <div><Label>Email</Label><Input required type="email" /></div>
            <div><Label>Phone</Label><Input required type="tel" /></div>
            <div><Label>Password</Label><Input required type="password" /></div>
            <div><Label>Confirm Password</Label><Input required type="password" /></div>
            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" required className="mt-0.5" />
              <span>I agree to the <Link to="/terms" className="text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link></span>
            </label>
            <Button type="submit" className="w-full" size="lg">Create Account</Button>
          </form>
          <p className="text-center text-sm mt-6 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
        <AccountSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Register;
