"use client";

/**
 * app/admin/login/page.tsx — Admin Login Page
 * Uses NextAuth v5 signIn with credentials provider.
 */

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, LogIn, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (res?.error || !res?.ok) {
        setError("Invalid username or password. Please check your credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--bg-primary)]">
      {/* Background */}
      <div className="absolute inset-0 hero-grid opacity-20" />
      <div className="absolute inset-0 hero-radial" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-indigo-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-500/5 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative z-10 w-full max-w-sm px-4"
      >
        <div className="card-glass p-8 md:p-10">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 mb-4">
              <Lock size={24} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
              Admin Access
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Jefferson Padua Portfolio
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
            >
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                autoComplete="username"
                className="form-input"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="form-input pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              id="admin-login-btn"
              disabled={loading || !username || !password}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={cn(
                "w-full flex items-center justify-center gap-2 mt-2",
                "px-6 py-3 rounded-xl text-sm font-semibold text-white",
                "bg-gradient-to-r from-indigo-600 to-violet-600",
                "hover:from-indigo-500 hover:to-violet-500",
                "shadow-lg hover:shadow-indigo-500/30 transition-all",
                (loading || !username || !password) && "opacity-60 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Sign In
                </>
              )}
            </motion.button>
          </form>

          {/* Hint */}
          <div className="mt-6 p-3 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border-color)]">
            <p className="text-xs text-[var(--text-muted)] text-center">
              Credentials are set in{" "}
              <code className="text-indigo-400 bg-indigo-500/10 px-1 rounded">.env.local</code>
              <br />
              <span className="text-[10px]">ADMIN_USERNAME &amp; ADMIN_PASSWORD</span>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-[var(--text-muted)] mt-4">
          <Link href="/" className="hover:text-indigo-400 transition-colors">
            ← Back to portfolio
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams() requires it
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
