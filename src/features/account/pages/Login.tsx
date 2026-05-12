import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CircleCheck as CheckCircle2, Chrome as Home, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";

const Login = () => {
  useSeo("login");
  const nav = useNavigate();
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const sendOtp = () => {
    if (!phone || phone.length < 10) { toast.error("Enter a valid mobile number"); return; }
    setOtpSent(true);
    toast.success("OTP sent on WhatsApp (demo: 1234)");
  };
  const signIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) { toast.error("Enter the OTP"); return; }
    toast.success("Signed in (demo)");
    nav("/account");
  };

  return (
    <Layout>
      <div className="container-page py-6">
        <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary"><Home className="w-3.5 h-3.5" /></Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/account" className="hover:text-primary">My Account</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground">Login To Your Account</span>
        </nav>

        <div className="grid lg:grid-cols-[1fr_1fr_18rem] gap-5">
          {/* New Here */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 sm:p-8 flex flex-col">
            <h2 className="text-xl font-extrabold text-center">New Here?</h2>
            <p className="text-sm text-foreground/80 text-center mt-3 leading-relaxed">
              Create an account to shop faster, stay updated with exclusive offers, and keep track of the orders that you have previously made.
            </p>
            <ul className="space-y-2 mt-5 text-sm">
              {["Order medicines faster and securely","Track your prescriptions & order history","Receive updates on discounts and health tips"].map((t) => (
                <li key={t} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-accent mt-0.5 shrink-0" /><span>{t}</span></li>
              ))}
            </ul>
            <Button asChild size="lg" className="mt-auto pt-0 w-full mt-6"><Link to="/register">Create Account</Link></Button>
          </div>

          {/* Existing */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold">Already Have an Account?</h2>
            <p className="text-sm text-muted-foreground mt-2">Use your registered mobile number to receive an OTP on WhatsApp.</p>
            <form onSubmit={signIn} className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5">Registered WhatsApp Mobile Number</label>
                <div className="flex gap-2">
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter WhatsApp Number" inputMode="numeric" />
                  <Button type="button" variant="secondary" onClick={sendOtp} className="bg-primary/70 hover:bg-primary text-primary-foreground">
                    {otpSent ? "Resend OTP" : "Send OTP"}
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1.5">Enter the OTP recieved on whatsapp</label>
                <Input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter the OTP recieved on whatsapp" inputMode="numeric" />
              </div>
              <Button type="submit" size="lg" className="w-full">Sign In</Button>
            </form>
          </div>

          <AccountSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Login;
