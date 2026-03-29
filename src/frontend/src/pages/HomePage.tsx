import { AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { UserProfile } from "../backend";
import { useSendSOS } from "../hooks/useQueries";

interface HomePageProps {
  userProfile: UserProfile | null | undefined;
}

const HOLD_DURATION = 3000;
const CIRCUMFERENCE = 282.74;

export default function HomePage({ userProfile }: HomePageProps) {
  const sendSOS = useSendSOS();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const clearTimers = useCallback(() => {
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    holdTimerRef.current = null;
    progressTimerRef.current = null;
  }, []);

  const triggerSOS = useCallback(async () => {
    setTriggered(true);
    setProgress(100);
    clearTimers();
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 8000,
        }),
      );
      await sendSOS.mutateAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      toast.success("SOS Alert Sent! Your contacts have been notified.", {
        duration: 6000,
      });
    } catch (err: any) {
      if (err?.code === 1) {
        try {
          await sendSOS.mutateAsync({ latitude: 0, longitude: 0 });
          toast.success("SOS Alert Sent! (location unavailable)", {
            duration: 6000,
          });
        } catch {
          toast.error("Failed to send SOS. Please try again.");
          setTriggered(false);
        }
      } else {
        toast.error("Failed to send SOS. Please try again.");
        setTriggered(false);
      }
    }
  }, [sendSOS, clearTimers]);

  const handleHoldStart = () => {
    if (triggered) return;
    setHolding(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    progressTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100);
      setProgress(pct);
    }, 30);
    holdTimerRef.current = setTimeout(triggerSOS, HOLD_DURATION);
  };

  const handleHoldEnd = () => {
    if (!holding) return;
    setHolding(false);
    setProgress(0);
    clearTimers();
  };

  const strokeDashoffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-primary flex flex-col items-center justify-center px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-3">
          {userProfile ? `Stay Safe, ${userProfile.name}` : "Guardian"}
        </h1>
        <p className="text-primary-foreground/70 text-lg max-w-sm">
          Press and hold the SOS button for 3 seconds to send an emergency
          alert.
        </p>
      </div>

      <div className="relative flex items-center justify-center mb-10">
        {!holding && !triggered && (
          <>
            <span className="absolute w-56 h-56 rounded-full bg-destructive/20 sos-ring" />
            <span className="absolute w-56 h-56 rounded-full bg-destructive/10 sos-ring-2" />
          </>
        )}

        <svg
          className="absolute w-56 h-56"
          viewBox="0 0 100 100"
          role="img"
          aria-label="SOS progress indicator"
        >
          <title>SOS hold progress</title>
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeOpacity="0.3"
          />
          {holding && (
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                strokeDasharray: CIRCUMFERENCE,
                strokeDashoffset,
                transform: "rotate(-90deg)",
                transformOrigin: "center",
                transition: "stroke-dashoffset 0.03s linear",
              }}
            />
          )}
        </svg>

        <button
          type="button"
          data-ocid="sos.primary_button"
          onMouseDown={handleHoldStart}
          onMouseUp={handleHoldEnd}
          onMouseLeave={handleHoldEnd}
          onTouchStart={handleHoldStart}
          onTouchEnd={handleHoldEnd}
          className={`relative z-10 w-44 h-44 rounded-full flex flex-col items-center justify-center select-none transition-transform ${
            triggered
              ? "bg-green-500 shadow-[0_0_60px_rgba(34,197,94,0.6)]"
              : holding
                ? "bg-destructive scale-95 shadow-pink-glow"
                : "bg-destructive shadow-pink-glow sos-btn-pulse hover:scale-105 active:scale-95"
          } cursor-pointer`}
          style={{ touchAction: "none" }}
          aria-label="SOS Emergency Button — Hold for 3 seconds"
        >
          {triggered ? (
            <>
              <CheckCircle2 className="w-12 h-12 text-white mb-1" />
              <span className="text-white font-bold text-lg tracking-wide">
                SENT
              </span>
            </>
          ) : (
            <>
              <Shield className="w-10 h-10 text-white mb-1" />
              <span className="font-display font-bold text-3xl text-white tracking-widest">
                SOS
              </span>
              <span className="text-white/70 text-xs mt-1">
                {holding ? "Keep holding..." : "Hold 3 sec"}
              </span>
            </>
          )}
        </button>
      </div>

      {triggered && (
        <div
          data-ocid="sos.success_state"
          className="flex items-center gap-2 bg-primary-foreground/10 border border-primary-foreground/20 rounded-full px-6 py-3 text-primary-foreground"
        >
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="font-medium">SOS alert sent successfully</span>
        </div>
      )}

      {sendSOS.isPending && (
        <div
          data-ocid="sos.loading_state"
          className="mt-4 text-primary-foreground/60 text-sm animate-pulse"
        >
          Sending SOS...
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {[
          {
            icon: Shield,
            title: "Instant Alert",
            desc: "SOS sent to all trusted contacts instantly",
          },
          {
            icon: AlertTriangle,
            title: "Location Shared",
            desc: "Your GPS coordinates are included",
          },
          {
            icon: CheckCircle2,
            title: "Stay Calm",
            desc: "Help is on the way — you're not alone",
          },
        ].map((tip) => {
          const Icon = tip.icon;
          return (
            <div
              key={tip.title}
              className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl p-4 text-center"
            >
              <Icon className="h-6 w-6 text-primary-foreground/80 mx-auto mb-2" />
              <h3 className="font-semibold text-primary-foreground text-sm mb-1">
                {tip.title}
              </h3>
              <p className="text-primary-foreground/60 text-xs leading-relaxed">
                {tip.desc}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
