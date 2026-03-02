import { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";

export default function StaticCountdown({ month, day, title }) {
  const midnightRef = useRef(null);

  function compute() {
    const today = Temporal.Now.plainDateISO();
    const currentYear = today.year;

    let target = Temporal.PlainDate.from({ year: currentYear, month, day });

    if (target.since(today).days < 0) {
      target = target.add({ years: 1 });
    }

    return target.since(today).days;
  }

  const [daysRemaining, setDaysRemaining] = useState(() => compute());

  const scheduleMidnight = () => {
    const now = Temporal.Now.plainDateTimeISO();
    const tomorrowMidnight = now
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const ms = tomorrowMidnight
      .since(now, { smallestUnit: "millisecond" })
      .total("millisecond");

    midnightRef.current = setTimeout(() => {
      setDaysRemaining(compute());
      scheduleMidnight();
    }, ms);
  };

  useEffect(() => {
    scheduleMidnight();
    return () => midnightRef.current && clearTimeout(midnightRef.current);
  }, []);

  return (
    <Card elevation={1} sx={{ p: 2, textAlign: "center" }}>
      <CardHeader
        title={title}
        sx={{
          fontFamily:
            "'JetBrains Mono', 'Consolas', 'Lucida Console', 'DejaVu Sans Mono', monospace",
          textAlign: "center",
          color: "#fff",
          textShadow: `
      0 0 2px #ffffff,
      0 0 6px #66ccff,
      0 0 12px #33bbff,
      0 0 20px #0099ff,
      0 0 40px #0099ff,
      0 0 80px #0099ff
    `,
        }}
      />

      <CardContent>
        <Typography variant="h1">{daysRemaining}</Typography>
      </CardContent>
    </Card>
  );
}
