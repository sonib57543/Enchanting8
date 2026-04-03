"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // Secure backend-verified redirection
        const session = await getSession();
        
        if ((session?.user as any)?.role) {
          router.refresh(); // Clear client-side router cache aggressively
          if ((session?.user as any).role === "admin") {
            router.push("/admin");
          } else {
            router.push("/vendor/dashboard");
          }
        } else {
           // Extreme Fallback
           window.location.href = "/vendor/dashboard"; 
        }
      }
    } catch (err) {
      setError("An unexpected server error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-nature-50">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-gradient-to-b from-earth-900 to-nature-50 rounded-b-[4rem] opacity-90 shadow-2xl"></div>
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-earth-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-nature-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 relative z-0"></div>

      <div className="w-full max-w-lg px-4 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-10 md:p-12 border border-white/50">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-earth-100 text-earth-700 mb-6 shadow-inner ring-4 ring-white">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="font-serif text-4xl font-bold text-nature-900 mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-nature-600 font-medium">Log in to access your secure portal</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 border border-red-100 rounded-2xl text-sm font-bold flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
               {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-nature-700 px-2 uppercase tracking-wider text-[11px]">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nature-400 group-focus-within:text-earth-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-nature-50/50 border border-nature-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-earth-100 focus:border-earth-400 transition-all font-medium text-nature-900 placeholder:text-nature-400 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-2">
                <label className="block text-sm font-bold text-nature-700 uppercase tracking-wider text-[11px]">Password</label>
                <Link href="#" className="text-[11px] text-earth-600 font-bold hover:text-earth-800 transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nature-400 group-focus-within:text-earth-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl bg-nature-50/50 border border-nature-200 focus:bg-white focus:outline-none focus:ring-4 focus:ring-earth-100 focus:border-earth-400 transition-all font-medium text-nature-900 placeholder:text-nature-400 shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-3 bg-gradient-to-r from-earth-600 to-earth-500 hover:from-earth-700 hover:to-earth-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all shadow-[0_8px_20px_-6px_rgba(202,138,4,0.4)] hover:shadow-[0_12px_25px_-6px_rgba(202,138,4,0.5)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  Secure Login <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-nature-100 text-center">
            <p className="text-nature-500 text-sm mb-3">Want to partner with Enchanting8?</p>
            <Link
              href="/vendor-register"
              className="inline-flex items-center gap-1 text-earth-600 font-bold hover:text-earth-800 transition-colors"
            >
              Register as a Vendor <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
