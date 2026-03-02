import { useEffect, useState } from "react";
import { Card, CardContent, Paper, Typography } from "@mui/material";

export default function NeonClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time
    .toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(/\s?[AP]M$/i, "");

  return (
    <Card elevation={1} sx={{ p: 2 }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{
            fontFamily:
              "'JetBrains Mono', 'Consolas', 'Lucida Console', 'DejaVu Sans Mono', monospace",
            textAlign: "center",
            color: "#fff",
            textShadow: `
      0 0 2px #fff,
      0 0 6px #ff66ff,
      0 0 12px #ff00ff,
      0 0 20px #ff00ff,
      0 0 40px #ff00ff,
      0 0 80px #ff00ff
    `,
          }}
        >
          {timeString}
        </Typography>
      </CardContent>
    </Card>
  );
}
