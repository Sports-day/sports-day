import { useState, useEffect } from "react";
import { Alert, AlertTitle, Collapse } from "@mui/material";
import { subscribe, type NotificationEvent } from "@/src/lib/notifications";

export const MatchApproachingAlert = () => {
  const [alerts, setAlerts] = useState<
    { matchId: string; minutesBefore: number }[]
  >([]);

  useEffect(() => {
    const unsubscribe = subscribe((event: NotificationEvent) => {
      if (event.type === "MATCH_APPROACHING") {
        setAlerts((prev) => {
          if (prev.some((a) => a.matchId === event.matchId)) return prev;
          return [
            ...prev,
            { matchId: event.matchId, minutesBefore: event.minutesBefore },
          ];
        });
      }
    });
    return unsubscribe;
  }, []);

  const handleDismiss = (matchId: string) => {
    setAlerts((prev) => prev.filter((a) => a.matchId !== matchId));
  };

  if (alerts.length === 0) return null;

  return (
    <>
      {alerts.map((alert) => (
        <Collapse key={alert.matchId} in={true}>
          <Alert
            severity="warning"
            onClose={() => handleDismiss(alert.matchId)}
            sx={{ mb: 1 }}
          >
            <AlertTitle>審判の試合が近づいています</AlertTitle>
            まもなく審判の試合が始まります（
            {alert.minutesBefore > 0
              ? `${alert.minutesBefore}分前`
              : "間もなく"}
            ）。出席確認をしてください。
          </Alert>
        </Collapse>
      ))}
    </>
  );
};
