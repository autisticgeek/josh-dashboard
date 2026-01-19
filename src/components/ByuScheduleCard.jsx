import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent, Typography } from "@mui/material";

const SPORT_MAP = {
  1411: "🏀 Women's Basketball",
  1478: "⛳️ Golf",
  1480: "🏀 Men's Basketball",
  1514: "🤿 Swimming & Diving",
  1515: "🤿 Swimming & Diving",
  1516: "🏐 Women's Volleyball",
  1554: "🏐 Men's Volleyball",
  1555: "🏃‍♀️ Women's Track & Field",
};

export function ByuScheduleCard() {
  const [games, setGames] = useState(null);

  useEffect(() => {
    async function load() {
      const url =
        "https://byucougars.com/website-api/schedule-events?filter[upcoming]=true&filter[hide_from_all_sports_schedule]=false&sort=datetime&per_page=50&page=1";

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
            sport: SPORT_MAP[event.schedule_id] || "Unknown Sport",
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
  }, []);

  if (!games) return null;

  const formatGame = (g) => {
    const dateStr = g.date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return `${g.sport} • ${g.opponent} • ${dateStr} • ${g.time}`;
  };

  return (
    <Card
      elevation={3}
      sx={{
        maxHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader title="BYU Upcoming Games" sx={{ pb: 0 }} />

      <CardContent
        sx={{
          pt: 1,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        {games.map((g, i) => (
          <Typography gutterBottom key={i}>
            {formatGame(g)}
          </Typography>
        ))}
      </CardContent>
    </Card>
  );
}
