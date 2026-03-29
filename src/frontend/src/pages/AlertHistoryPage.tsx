import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Clock, Loader2, MapPin } from "lucide-react";
import { useGetAlertHistory } from "../hooks/useQueries";

function formatTimestamp(ts: bigint): string {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AlertHistoryPage() {
  const { data: alerts, isLoading } = useGetAlertHistory();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold text-primary">
          Alert History
        </h2>
        {alerts && alerts.length > 0 && (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 font-semibold">
            {alerts.length} Alert{alerts.length !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      <Card className="border-border shadow-card-pink">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-destructive" />
            SOS Alerts Sent
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div
              data-ocid="alerts.loading_state"
              className="flex justify-center py-8"
            >
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          ) : !alerts || alerts.length === 0 ? (
            <div
              data-ocid="alerts.empty_state"
              className="text-center py-12 text-muted-foreground"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-border" />
              </div>
              <p className="font-medium text-sm">No SOS alerts sent yet</p>
              <p className="text-xs mt-1 max-w-xs mx-auto">
                Your alert history will appear here after you send an SOS.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {[...alerts].reverse().map((alert, idx) => (
                <div
                  key={`${String(alert.timestamp)}-${alert.latitude}-${alert.longitude}`}
                  data-ocid={`alerts.item.${idx + 1}`}
                  className="p-4 rounded-2xl border border-destructive/20 bg-destructive/5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-destructive" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-foreground">
                          🚨 SOS Alert #{alerts.length - idx}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(alert.timestamp)}
                        </div>
                        {(alert.latitude !== 0 || alert.longitude !== 0) && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" />
                            {alert.latitude.toFixed(5)},{" "}
                            {alert.longitude.toFixed(5)}
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs shrink-0">
                      Sent
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
