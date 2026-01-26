import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SPORT_MAP = {
  1411: "Men's Basketball",
  1478: "Men's Golf",
  1480: "Women's Basketball",
  1516: "🎾 Women's Tennis",
  1555: "🏃‍♀️ Women's Track & Field",
  1556: "🏃 Mens's Track & Field",
};

function msUntilMidnight() {
  const now = new Date();
  const midnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  return midnight - now;
}

export function ByuScheduleCard() {
  const [games, setGames] = useState(null);

  useEffect(() => {
    async function load() {
      const url =
        "https://byucougars.com/website-api/schedule-events?filter[upcoming]=true&filter[hide_from_all_sports_schedule]=false&sort=datetime&per_page=20&page=1";

      const res = await fetch(url, {
        headers: {
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest",
          Referer: "https://byucougars.com/",
        },
      });

      const data = await res.json();
      const events = data.data || [];

      const normalized = events
        .map((event) => {
          const date = new Date(event.datetime);

          return {
            sport:
              SPORT_MAP[event.schedule_id] ||
              `Unknown Sport ${event.schedule_id}`,
            date,
            opponent: event.opponent_name || "TBD",
            time: date.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            broadcast: event.broadcast || "TBD",
          };
        })
        .sort((a, b) => a.date - b.date);

      setGames(normalized.slice(0, 3));
    }

    load();

    const timeout = setTimeout(() => {
      load();
      const interval = setInterval(load, 24 * 60 * 60 * 1000);
      cleanup.interval = interval;
    }, msUntilMidnight());

    const cleanup = {};
    return () => {
      clearTimeout(timeout);
      if (cleanup.interval) clearInterval(cleanup.interval);
    };
  }, []);

  if (!games) return null;

  const formatGame = (g) => {
    const dateStr = g.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <ListItem disableGutters>
        <ListItemText
          primary={`${g.sport} • ${g.opponent}`}
          secondary={`${dateStr} • ${g.time}`}
          slotProps={{
            primary: { variant: "body1" },
            secondary: { variant: "body2" },
          }}
        />
      </ListItem>
    );
  };

  return (
    <Card elevation={3}>
      <CardHeader title="BYU Upcoming Games" sx={{ pb: 0 }} />
      <CardContent sx={{ pt: 1 }}>
        <List dense>
          {games.map((g, i) => (
            <Fragment key={i}>{formatGame(g)}</Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
