import { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import "@fontsource-variable/tilt-neon";

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
          fontFamily: "'Tilt Neon Variable', system-ui",
          textAlign: "center",
          color: "#66ccff", // bright neon blue
          textShadow: `
      0 0 4px #ffffff,
      0 0 8px #66ccff,
      0 0 12px #33bbff,
      0 0 16px #0099ff,
      0 0 24px #0088ff
    `,
        }}
      />

      <CardContent>
        <Typography variant="h1">{daysRemaining}</Typography>
      </CardContent>
    </Card>
  );
}
