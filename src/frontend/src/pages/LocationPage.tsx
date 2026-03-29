import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Loader2, MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCheckIn, useGetLocationHistory } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString();
}

export default function LocationPage() {
  const checkIn = useCheckIn();
  const { data: history, isLoading } = useGetLocationHistory();
  const [locating, setLocating] = useState(false);

  const latestCheckin =
    history && history.length > 0 ? history[history.length - 1] : null;

  const handleCheckIn = async () => {
    setLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
        }),
      );
      setLocating(false);
      await checkIn.mutateAsync({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      });
      toast.success("📍 Location recorded successfully!");
    } catch (err: any) {
      setLocating(false);
      if (err?.code === 1) {
        toast.error(
          "Location access denied. Please enable location permissions.",
        );
      } else {
        toast.error("Failed to get location. Please try again.");
      }
    }
  };

  const mapSrc = latestCheckin
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${latestCheckin.longitude - 0.01}%2C${latestCheckin.latitude - 0.01}%2C${latestCheckin.longitude + 0.01}%2C${latestCheckin.latitude + 0.01}&layer=mapnik&marker=${latestCheckin.latitude}%2C${latestCheckin.longitude}`
    : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-primary">
          Location Tracker
        </h2>
        <Button
          data-ocid="location.primary_button"
          onClick={handleCheckIn}
          disabled={locating || checkIn.isPending}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold"
        >
          {locating || checkIn.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Getting
              location...
            </>
          ) : (
            <>
              <Navigation className="mr-2 h-4 w-4" /> Record My Location
            </>
          )}
        </Button>
      </div>

      <Card className="border-border shadow-card-pink overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" />
            Latest Location
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mapSrc ? (
            <iframe
              src={mapSrc}
              title="Latest location map"
              className="w-full h-64 md:h-96 border-0"
              loading="lazy"
            />
          ) : (
            <div
              data-ocid="location.empty_state"
              className="h-48 flex flex-col items-center justify-center text-muted-foreground gap-3"
            >
              <MapPin className="h-10 w-10 text-border" />
              <p className="text-sm">
                No location recorded yet. Record your first check-in!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border shadow-card-pink">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent" />
            Check-in History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              data-ocid="location.loading_state"
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !history || history.length === 0 ? (
            <div
              data-ocid="location.history.empty_state"
              className="text-center py-8 text-muted-foreground"
            >
              <MapPin className="h-8 w-8 mx-auto mb-2 text-border" />
              <p className="text-sm">No check-ins yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {[...history].reverse().map((item, idx) => (
                <div
                  key={`${item.latitude}-${item.longitude}-${String(item.timestamp)}`}
                  data-ocid={`location.item.${idx + 1}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {item.latitude.toFixed(5)}, {item.longitude.toFixed(5)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(item.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-primary/20 text-xs"
                  >
                    #{history.length - idx}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
