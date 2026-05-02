import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const nav = useNavigate();
  const submit = (e: React.FormEvent) => { e.preventDefault(); toast.success("Logged in (demo)"); nav("/account"); };
  return (
    <Layout>
      <div className="container-page py-12 flex justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-extrabold text-center">Welcome Back</h1>
          <p className="text-sm text-muted-foreground text-center mt-1">Sign in to continue shopping</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div><Label>Email or Phone</Label><Input required placeholder="you@example.com" /></div>
            <div><Label>Password</Label><Input required type="password" placeholder="••••••••" /></div>
            <div className="flex justify-between text-xs">
              <label className="flex items-center gap-2"><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" className="w-full" size="lg">Sign In</Button>
          </form>
          <div className="my-5 text-center text-xs text-muted-foreground">or continue with</div>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">Google</Button>
            <Button variant="outline">Facebook</Button>
          </div>
          <p className="text-center text-sm mt-6 text-muted-foreground">
            New here? <Link to="/register" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};
export default Login;
