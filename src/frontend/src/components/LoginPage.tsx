import { Button } from "@/components/ui/button";
import { Bell, Loader2, MapPin, Shield, Users } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  const features = [
    {
      icon: Shield,
      title: "SOS Alert",
      desc: "One-tap emergency alert to trusted contacts",
    },
    {
      icon: MapPin,
      title: "Location Sharing",
      desc: "Real-time location tracking and history",
    },
    {
      icon: Users,
      title: "Trusted Contacts",
      desc: "Manage your emergency contact list",
    },
    {
      icon: Bell,
      title: "Alert History",
      desc: "Review all past SOS alerts and check-ins",
    },
  ];

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/assets/generated/she-safe-logo-transparent.dim_120x120.png"
            alt="She Safe"
            className="h-16 w-16 object-contain"
          />
          <h1 className="font-display text-5xl font-bold text-primary-foreground">
            She Safe
          </h1>
        </div>

        <p className="text-primary-foreground/80 text-xl max-w-md mb-10 leading-relaxed">
          Your personal safety companion — always ready when you need it most.
        </p>

        {/* SOS preview ring */}
        <div className="relative mb-10">
          <div className="w-32 h-32 rounded-full bg-destructive flex items-center justify-center sos-btn-pulse shadow-pink-glow cursor-default select-none">
            <span className="font-display font-bold text-2xl text-white tracking-widest">
              SOS
            </span>
          </div>
        </div>

        <Button
          data-ocid="login.primary_button"
          onClick={login}
          disabled={isLoggingIn}
          className="bg-destructive hover:bg-destructive/90 text-white font-semibold text-lg px-10 py-6 rounded-full shadow-pink-glow"
        >
          {isLoggingIn ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
            </>
          ) : (
            "Get Started — Login"
          )}
        </Button>

        <p className="text-primary-foreground/50 text-sm mt-4">
          Secure login with Internet Identity
        </p>
      </div>

      {/* Features */}
      <div className="bg-secondary py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-2xl font-bold text-primary text-center mb-8">
            Everything you need to stay safe
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-card rounded-2xl p-4 shadow-card-pink border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-primary py-4 px-4 text-center">
        <p className="text-primary-foreground/50 text-xs">
          © {new Date().getFullYear()} She Safe. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-foreground/70 hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
