import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
const logoImage = "/images/ASLogo.png";
import { ArrowRight, Sparkles, Stars, Users } from "lucide-react";

export default function LoginScreen() {
  const handleLogin = () => {
    window.location.href = "/login";
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
        <div className="absolute -bottom-20 left-10 h-80 w-80 rounded-full bg-secondary/25 blur-[160px]" />
        <div className="absolute left-1/2 top-1/3 h-56 w-56 -translate-x-1/2 rounded-full bg-chakra-crown/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(120,116,255,0.15),transparent_50%)]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <Card className="relative w-full overflow-hidden border border-white/15 bg-white/5 shadow-[0_0_60px_rgba(100,116,139,0.25)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5" />
          <CardContent className="relative grid gap-10 p-8 sm:p-12 md:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-between gap-10">
              <div>
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  <Sparkles className="h-4 w-4 text-white/80" />
                  Ascended Social
                </div>
                <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  A luminous place to share your inner journey.
                </h1>
                <p className="mt-4 max-w-md text-base text-white/70">
                  Discover spiritual communities, exchange wisdom, and grow with
                  others aligned to your energy.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <Stars className="h-5 w-5 text-secondary" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Guided rituals
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Curated spaces for alignment and intention.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Soulful circles
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Meet seekers who match your frequency.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                  <Sparkles className="h-5 w-5 text-chakra-crown" />
                  <p className="mt-3 text-sm font-semibold text-white">
                    Daily insights
                  </p>
                  <p className="mt-1 text-xs text-white/60">
                    Reflect with prompts designed for growth.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-8 rounded-3xl border border-white/15 bg-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-primary/30 blur-md" />
                  <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-white/30">
                    <img
                      src={logoImage}
                      alt="Ascended Social"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-white">Welcome back</p>
                  <p className="font-display text-2xl font-semibold text-white">
                    Sign in
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handleLogin}
                  size="lg"
                  className="w-full justify-center gap-2 bg-white text-slate-950 shadow-lg transition-transform duration-300 hover:scale-[1.01] hover:bg-white"
                  data-testid="button-login-replit"
                >
                  Continue with Replit
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="text-xs text-white/60">
                  Use your Replit account to access your Ascended Social space.
                </p>
              </div>

              <div className="space-y-3 text-sm text-white/70">
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <span>New to Ascended Social?</span>
                  <a
                    href="https://ascendedsocial.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-primary transition-colors"
                  >
                    Learn more
                  </a>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
                  <span>Explore features</span>
                  <a
                    href="https://ascendedsocial.com/features"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-white hover:text-primary transition-colors"
                  >
                    View guide
                  </a>
                </div>
              </div>

              <p className="text-[11px] text-white/50">
                By logging in, you agree to our{" "}
                <a
                  href="https://ascendedsocial.com/legal/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors underline"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="https://ascendedsocial.com/legal/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-white transition-colors underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
