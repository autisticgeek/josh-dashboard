import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Paper,
  Typography,
} from "@mui/material";
import "@fontsource-variable/tilt-neon";

export default function NeonClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <Paper elevation={1}>
      <Card sx={{ p: 2 }}>
        <CardContent>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Tilt Neon Variable', system-ui",
              textAlign: "center",
              color: "#ff66ff", // soft neon pink
              textShadow: `
                0 0 4px #fff,
                0 0 8px #ff66ff,
                0 0 12px #ff00ff,
                0 0 16px #ff00ff,
                0 0 24px #ff00ff
              `,
            }}
          >
            {timeString}
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
}
