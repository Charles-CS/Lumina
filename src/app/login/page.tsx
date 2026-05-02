"use client";

import Link from "next/link";
import { ArrowLeft, Sun, Moon, Monitor } from "lucide-react";
import { LuminaLogo } from "@/components/ui/LuminaLogo";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [tab, setTab] = useState<"signin" | "signup" | "forgot">("signin");
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isEnteringLumina, setIsEnteringLumina] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length > 5) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score <= 4) return { score: 2, label: "Moderate", color: "bg-yellow-500" };
    return { score: 3, label: "Strong", color: "bg-green-500" };
  };

  const strength = getPasswordStrength(password);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = mounted ? theme : "system";

  const GoogleIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    setSuccessMsg(null);
    // Mocking Google login for the demo to prevent Supabase redirect error
    setTimeout(() => {
      setLoading(false);
      setIsEnteringLumina(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }, 1000);
  };

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const PolicyModal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-section-bg border border-black/10 dark:border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto pr-2 custom-scrollbar text-sm text-black/70 dark:text-white/70 leading-relaxed space-y-6">
              {children}
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-black/5 dark:border-white/5 shrink-0 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-black/10 dark:shadow-white/5"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div className="h-screen overflow-hidden bg-page-bg text-foreground flex items-center justify-center p-4 relative w-full transition-colors duration-300">

        {/* Back Button */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-2 text-[13px] font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back to landing page
        </Link>

        {/* Theme toggle */}
        {mounted && (
          <div className="absolute top-6 right-6 flex items-center gap-0.5 rounded-full border border-black/[0.08] bg-black/[0.03] dark:border-white/[0.05] dark:bg-white/[0.02] p-0.5 shadow-inner">
            <button
              onClick={() => setTheme("light")}
              aria-label="Light mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "light"
                  ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                  : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Sun size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setTheme("system")}
              aria-label="System mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "system"
                  ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                  : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Monitor size={11} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setTheme("dark")}
              aria-label="Dark mode"
              className={`flex h-[22px] w-[22px] items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${activeTheme === "dark"
                  ? "bg-black/10 dark:bg-white/15 text-black dark:text-white shadow-sm"
                  : "text-black/40 dark:text-white/60 hover:text-black dark:hover:text-white/90"
                }`}
            >
              <Moon size={11} strokeWidth={2.5} />
            </button>
          </div>
        )}

        <div className="w-full max-w-[420px] bg-section-bg border border-black/10 dark:border-white/10 rounded-2xl p-8 shadow-2xl relative transition-colors duration-300">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center min-h-[140px]">
            <div className="scale-125 mb-6">
              <LuminaLogo />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="flex flex-col items-center"
              >
                <h1 className="text-2xl font-semibold mb-2">
                  {tab === "signin" ? "Sign in to Lumina" : tab === "signup" ? "Create an account" : "Reset your password"}
                </h1>
                <p className="text-sm text-black/50 dark:text-white/50 text-center px-4">
                  {tab === "signin"
                    ? "Sign in to access your account and use all features"
                    : tab === "signup"
                      ? "Sign up today to get started with Lumina features"
                      : "Enter your email address and we'll send you a link to reset your password"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {tab !== "forgot" && (
            <>
              {/* Social Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-black/[0.03] hover:bg-black/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl py-3 px-4 text-sm font-medium transition-colors disabled:opacity-50"
              >
                <GoogleIcon />
                Continue with Google
              </button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-1" />
                <span className="text-[10px] uppercase text-black/40 dark:text-white/40 tracking-widest font-medium">OR</span>
                <div className="h-[1px] bg-black/10 dark:bg-white/10 flex-1" />
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-black/[0.03] dark:bg-white/[0.03] border border-black/10 dark:border-white/10 rounded-lg mb-6 relative">
                {tab === "signin" && (
                  <motion.div
                    layoutId="tabBackground"
                    className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-white dark:bg-[#222222] rounded-md shadow-sm border border-black/5 dark:border-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {tab === "signup" && (
                  <motion.div
                    layoutId="tabBackground"
                    className="absolute top-1 bottom-1 right-1 w-[calc(50%-4px)] bg-white dark:bg-[#222222] rounded-md shadow-sm border border-black/5 dark:border-none"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <button
                  onClick={() => { setTab("signin"); setError(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors relative z-10 ${tab === "signin"
                      ? "text-black dark:text-white"
                      : "text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80"
                    }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setTab("signup"); setError(null); setSuccessMsg(null); }}
                  className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors relative z-10 ${tab === "signup"
                      ? "text-black dark:text-white"
                      : "text-black/50 dark:text-white/50 hover:text-black/80 dark:hover:text-white/80"
                    }`}
                >
                  Sign Up
                </button>
              </div>
            </>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            setError(null);
            setSuccessMsg(null);
            try {
              if (tab === "signup") {
                const { error: signUpError } = await supabase.auth.signUp({ email, password });
                if (signUpError) throw signUpError;
                setLoading(false);
                setShowSuccessModal(true);
              } else if (tab === "signin") {
                const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
                if (signInError) throw signInError;
                setLoading(false);
                setIsEnteringLumina(true);
                setTimeout(() => {
                  router.push("/dashboard");
                }, 2000);
              } else if (tab === "forgot") {
                const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
                if (resetError) throw resetError;
                setSuccessMsg("Password reset link sent to your email.");
                setLoading(false);
              }
            } catch (err: any) {
              setError(err.message || "An error occurred");
              setLoading(false);
            }
          }}>
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-black/90 dark:text-white/90 w-full text-left">Email</label>
              <input
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-black/[0.02] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.04] dark:focus:bg-[#161616] transition-colors placeholder:text-black/30 dark:placeholder:text-white/30"
              />
            </div>

            {tab !== "forgot" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-[13px] font-medium text-black/90 dark:text-white/90">Password</label>
                  <AnimatePresence>
                    {tab === "signin" && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        type="button"
                        onClick={() => { setTab("forgot"); setError(null); setSuccessMsg(null); }}
                        className="text-[12px] text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                      >
                        Forgot password?
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black/[0.02] dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-xl px-4 py-3 text-[13px] focus:outline-none focus:border-black/20 dark:focus:border-white/20 focus:bg-black/[0.04] dark:focus:bg-[#161616] transition-colors placeholder:text-black/30 dark:placeholder:text-white/30 tracking-widest"
                />

                <AnimatePresence>
                  {tab === "signup" && password.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-2">
                        <div className="flex gap-1 mb-1.5">
                          {[1, 2, 3].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-colors duration-300 ${strength.score >= level ? strength.color : "bg-black/10 dark:bg-white/10"
                                }`}
                            />
                          ))}
                        </div>
                        <p className={`text-[11px] font-medium transition-colors duration-300 ${strength.score === 1 ? "text-red-500" :
                            strength.score === 2 ? "text-yellow-500" : "text-green-500"
                          }`}>
                          {strength.label} password
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="text-[12px] font-medium text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mt-2">
                    {error}
                  </div>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="text-[12px] font-medium text-green-600 dark:text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 mt-2">
                    {successMsg}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black py-3 px-4 rounded-xl text-sm font-semibold transition-colors mt-6 h-[46px] disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <AnimatePresence mode="wait">
                <motion.span
                  key={tab}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="whitespace-nowrap"
                >
                  {tab === "signin" ? "Sign In" : tab === "signup" ? "Sign Up" : "Send Reset Link"}
                </motion.span>
              </AnimatePresence>
            </button>
          </form>

          <AnimatePresence>
            {tab === "forgot" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => { setTab("signin"); setError(null); setSuccessMsg(null); }}
                  className="w-full mt-4 text-[13px] font-medium text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
                >
                  Back to sign in
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Text */}
          <p className="text-[11px] text-black/40 dark:text-white/40 text-center mt-8 h-[20px]">
            <AnimatePresence mode="wait">
              <motion.span
                key={tab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="inline-block relative z-10"
              >
                {tab !== "forgot" && (
                  <>
                    By {tab === "signin" ? "signing in" : "signing up"}, you agree to our{" "}
                    <button
                      onClick={() => setShowTermsModal(true)}
                      className="underline hover:text-black dark:hover:text-white transition-colors decoration-black/20 dark:decoration-white/20 underline-offset-2"
                    >
                      Terms of Service
                    </button>
                    {" "}and{" "}
                    <button
                      onClick={() => setShowPrivacyModal(true)}
                      className="underline hover:text-black dark:hover:text-white transition-colors decoration-black/20 dark:decoration-white/20 underline-offset-2"
                    >
                      Privacy Policy
                    </button>.
                  </>
                )}
              </motion.span>
            </AnimatePresence>
          </p>

        </div>
      </div>

      {/* Terms of Service Modal */}
      <PolicyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="Terms of Service"
      >
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">1. Acceptance of Terms</h3>
          <p>By accessing and using Lumina, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">2. Use License</h3>
          <p>Permission is granted to temporarily use Lumina for personal or commercial website creation. This is the grant of a license, not a transfer of title.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">3. User Accounts</h3>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">4. Content Ownership</h3>
          <p>You retain all rights to the content you create and upload to Lumina. Lumina does not claim ownership of your intellectual property.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">5. Prohibited Activities</h3>
          <p>Users are prohibited from using Lumina for any unlawful purposes, infringing on intellectual property rights, or attempting to compromise the security of the platform.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">6. Limitation of Liability</h3>
          <p>Lumina shall not be liable for any damages arising out of the use or inability to use the platform, even if Lumina has been notified of the possibility of such damage.</p>
        </section>
      </PolicyModal>

      {/* Privacy Policy Modal */}
      <PolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="Privacy Policy"
      >
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our website building tools.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">2. How We Use Information</h3>
          <p>We use the information we collect to provide, maintain, and improve our services, and to communicate with you about updates and new features.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">3. Data Security</h3>
          <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">4. Cookies</h3>
          <p>We use cookies and similar tracking technologies to analyze how users interact with Lumina and to personalize your experience.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">5. Third-Party Services</h3>
          <p>Lumina may use third-party service providers, such as Supabase for authentication and database management. These providers have access to your information only to perform specific tasks on our behalf.</p>
        </section>
        <section>
          <h3 className="text-black dark:text-white font-semibold mb-2">6. Changes to Policy</h3>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </section>
      </PolicyModal>

      {/* Success Modal for Signup */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-section-bg border border-black/10 dark:border-white/10 p-8 rounded-2xl w-full max-w-sm text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-transparent pointer-events-none" />
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold mb-2 relative z-10">Account Created!</h2>
              <p className="text-sm text-black/50 dark:text-white/50 mb-8 relative z-10">
                Your account has been successfully created. You can now access all lumina features.
              </p>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  setIsEnteringLumina(true);
                  setTimeout(() => {
                    router.push("/dashboard?tutorial=true");
                  }, 2000);
                }}
                className="w-full relative z-10 flex items-center justify-center gap-2 bg-black hover:bg-black/90 text-white dark:bg-white dark:hover:bg-white/90 dark:text-black py-3 rounded-xl text-sm font-semibold transition-colors"
              >
                Continue to Editor
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entering Lumina Loading Screen */}
      <AnimatePresence>
        {isEnteringLumina && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-page-bg"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring", stiffness: 100 }}
              className="flex flex-col items-center"
            >
              <div className="scale-150 mb-8 group">
                <div className="relative">
                  <LuminaLogo />
                  <motion.div
                    className="absolute inset-0 bg-white/20 dark:bg-black/20 mix-blend-overlay rounded-full blur-sm"
                    animate={{ rotate: 360, scale: [1, 1.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center gap-3 text-sm font-medium text-black/60 dark:text-white/60">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening Editor...
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}
