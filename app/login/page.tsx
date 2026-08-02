"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Eye, EyeOff, Lock, Mail, User, Loader2, GitBranch, MessageSquareText, Search } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/shared/components/ui/utils";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const isSignin = mode === "signin";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const { error } = isSignin
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({ email, password, name });

      if (error) {
        toast.error(error.message || "Something went wrong.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      if (error) {
        toast.error(error.message || "Google sign-in failed.");
        setGoogleLoading(false);
      }
      // On success, better-auth redirects the browser to Google, so no
      // further action is needed here.
    } catch {
      toast.error("Google sign-in failed.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left panel — branding */}
      <div
        className="relative hidden w-1/2 flex-col justify-between overflow-hidden p-12 lg:flex"
        style={{ background: "var(--sidebar)" }}
      >
        <div
          className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full blur-[120px]"
          style={{ background: "var(--rb-glow-primary)" }}
        />
        <div
          className="pointer-events-none absolute bottom-[-160px] right-[-100px] h-[380px] w-[380px] rounded-full blur-[120px]"
          style={{ background: "var(--rb-glow-accent)" }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <Image src="/repobrain_icon.svg" alt="RepoBrain" width={36} height={36} priority />
          <span className="text-lg font-semibold tracking-tight text-foreground">RepoBrain</span>
        </div>

        {/* Middle content */}
        <div className="relative z-10 max-w-md">
          <h2 className="text-3xl font-semibold leading-tight text-foreground">
            Understand any codebase in minutes, not days.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Connect a repo and chat with an AI agent that already knows every file,
            function, and dependency inside it.
          </p>

          <div className="mt-10 flex flex-col gap-5">
            <Feature
              icon={<GitBranch className="h-4 w-4" />}
              title="Index any repo"
              desc="Point it at a GitHub URL and it maps the whole codebase."
            />
            <Feature
              icon={<Search className="h-4 w-4" />}
              title="Ask anything"
              desc="Trace logic, find bugs, or get an onboarding tour."
            />
            <Feature
              icon={<MessageSquareText className="h-4 w-4" />}
              title="Chat like a teammate"
              desc="Follow-up questions, threads, and full history."
            />
          </div>
        </div>

        <p className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} RepoBrain. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo, mobile only */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <Image src="/repobrain_icon.svg" alt="RepoBrain" width={32} height={32} priority />
            <span className="text-base font-semibold tracking-tight text-foreground">RepoBrain</span>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">
                {isSignin ? "Welcome back" : "Create your account"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isSignin
                  ? "Sign in to continue to your repos."
                  : "Takes about 10 seconds to get started."}
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={googleLoading}
              onClick={handleGoogleSignIn}
              className="w-full gap-2 border-border bg-background/60"
            >
              {googleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GoogleIcon className="h-4 w-4" />
              )}
              Continue with Google
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {!isSignin && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border-border bg-background/60 pl-9"
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border-border bg-background/60 pl-9"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                {isSignin && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => toast.info("Password reset isn't wired up yet.")}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  className="border-border bg-background/60 px-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {!isSignin && (
                <p className="text-xs text-muted-foreground">Must be at least 8 characters.</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="mt-1 w-full gap-2"
              style={{ background: "var(--rb-cta-gradient)" }}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Please wait…" : isSignin ? "Sign in" : "Create account"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {isSignin ? "Need an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setMode(isSignin ? "signup" : "signin")}
                className="font-medium text-primary hover:underline"
              >
                {isSignin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-primary"
        style={{ background: "var(--rb-primary-subtle)", borderColor: "var(--rb-primary-subtle-border)" }}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.96H1.26v3.11A11.99 11.99 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.6H1.26a12 12 0 0 0 0 10.8l4.01-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.26 6.6l4.01 3.11C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}
