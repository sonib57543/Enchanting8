"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VendorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        // Enforce hard browser redirect to flush all Next.js caches and transmit cookies properly
        window.location.href = "/vendor/dashboard";
      }
    } catch (err) {
      setError("An unexpected server error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-nature-50 pt-32 pb-24 flex items-start justify-center px-4">
      <div className="bg-white max-w-md w-full p-8 md:p-12 rounded-3xl shadow-lg border border-nature-100">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-full bg-earth-500 text-white flex items-center justify-center text-xl mx-auto mb-4 font-serif font-bold">NE</div>
          <h1 className="font-serif text-2xl font-bold text-nature-900">Vendor Portal Login</h1>
          <p className="text-nature-500 text-sm mt-2">Access your partner dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-nature-900 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-nature-900 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-nature-50 border border-nature-200 rounded-xl px-4 py-3 text-nature-900 focus:outline-none focus:ring-2 focus:ring-earth-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-earth-500 hover:bg-earth-600 text-white font-bold py-3.5 rounded-xl transition-all mt-2 disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-nature-500 mt-6">
          Not registered yet?{" "}
          <Link href="/vendor-register" className="text-earth-600 font-bold hover:underline">Register as Vendor</Link>
        </p>
      </div>
    </div>
  );
}
