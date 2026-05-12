import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Chrome as Home, ChevronRight, Loader as Loader2, Phone, ShieldCheck, ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AccountSidebar } from "@/features/account/components/AccountSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { sendOtp, verifyOtp, resetOtp } from "@/store/slices/otpAuthSlice";
import { toast } from "sonner";
import { useSeo } from "@/hooks/useSeo";

const RESEND_SECONDS = 30;

const Register = () => {
  useSeo("register");
  const nav = useNavigate();
  const dispatch = useAppDispatch();
  const { otpSent, sending, verifying, error } = useAppSelector((s) => s.otpAuth);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => () => { dispatch(resetOtp()); }, [dispatch]);
  useEffect(() => {
    if (!otpSent) return;
    setResendIn(RESEND_SECONDS);
    const id = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [otpSent]);

  const onSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) { toast.error("Enter a valid 10-digit mobile number"); return; }
    const res = await dispatch(sendOtp({ phone, purpose: "register" }));
    if (sendOtp.fulfilled.match(res)) toast.success("OTP sent — use 123456 in demo mode");
    else toast.error((res.payload as string) || "Failed to send OTP");
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    const res = await dispatch(verifyOtp({ phone, otp, name, purpose: "register" }));
    if (verifyOtp.fulfilled.match(res)) {
      toast.success("Account created!");
      nav("/account");
    } else {
      toast.error((res.payload as string) || "Verification failed");
    }
  };

  const resend = async () => {
    if (resendIn > 0) return;
    const res = await dispatch(sendOtp({ phone, purpose: "register" }));
    if (sendOtp.fulfilled.match(res)) toast.success("OTP resent");
  };

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
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                {otpSent ? <ShieldCheck className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
              </div>
              <h1 className="text-2xl font-extrabold mt-3">
                {otpSent ? "Verify your number" : "Create your account"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {otpSent
                  ? <>We've sent a 6-digit code to <span className="font-semibold text-foreground">+91 {phone}</span></>
                  : "Sign up in seconds with just your mobile number"}
              </p>
            </div>

            {!otpSent ? (
              <form onSubmit={onSendOtp} className="mt-6 space-y-4 max-w-sm mx-auto">
                <div>
                  <Label htmlFor="rx-name">Full name (optional)</Label>
                  <Input id="rx-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="rx-phone">Mobile number</Label>
                  <div className="flex gap-2 mt-1">
                    <span className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-sm font-medium">+91</span>
                    <Input
                      id="rx-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={sending}>
                  {sending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending OTP…</> : "Send OTP"}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  By continuing you agree to our{" "}
                  <Link to="/terms" className="text-primary hover:underline">Terms</Link> &{" "}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            ) : (
              <form onSubmit={onVerify} className="mt-6 space-y-4 max-w-sm mx-auto">
                <div>
                  <Label htmlFor="rx-otp">Enter 6-digit OTP</Label>
                  <Input
                    id="rx-otp"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••••"
                    className="text-center text-lg tracking-[0.5em] font-bold"
                    autoFocus
                  />
                  {error && <p className="text-xs text-destructive mt-1">{error}</p>}
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={verifying}>
                  {verifying ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying…</> : "Verify & Create Account"}
                </Button>
                <div className="flex items-center justify-between text-xs">
                  <button type="button" onClick={() => dispatch(resetOtp())} className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-3 h-3" /> Change number
                  </button>
                  <button
                    type="button"
                    onClick={resend}
                    disabled={resendIn > 0 || sending}
                    className="text-primary font-semibold disabled:text-muted-foreground disabled:font-normal"
                  >
                    {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            <p className="text-center text-sm mt-8 text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
          <AccountSidebar />
        </div>
      </div>
    </Layout>
  );
};
export default Register;
