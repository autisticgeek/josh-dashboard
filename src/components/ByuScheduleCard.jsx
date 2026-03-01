import { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ICAL from "ical.js"; // npm install ical.js

const PROXY_URL = import.meta.env.VITE_WORKER_URL;
const API_KEY = import.meta.env.VITE_WORKER_KEY;

function getNextNDates(n = 7) {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i);
    d.setHours(0, 0, 0, 0);
    return d;
  });
}

function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function ByuScheduleCard() {
  const [games, setGames] = useState(null);

  useEffect(() => {
    async function load() {
      const url = `${PROXY_URL}/cors?url=https://calendar.byu.edu/iCal/Export/10`;
      const res = await fetch(url, {
        headers: {
          "x-autisticgeek-key": API_KEY,
        },
      });
      const text = await res.text();

      const jcal = ICAL.parse(text);
      const comp = new ICAL.Component(jcal);
      const vevents = comp.getAllSubcomponents("vevent");

      const next3Days = getNextNDates();

      const events = vevents
        .map((event) => {
          const e = new ICAL.Event(event);
          return {
            summary: e.summary,
            date: e.startDate.toJSDate(),
            time: e.startDate.toJSDate().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            }),
            location: e.location || "TBD",
          };
        })
        .filter((ev) => next3Days.some((d) => isSameDay(ev.date, d)))
        .sort((a, b) => a.date - b.date);

      setGames(events);
    }

    load();
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
          primary={`${g.summary}`}
          secondary={`${dateStr} • ${g.location} • ${g.time}`}
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
          {games.length
            ? games.map((g, i) => <Fragment key={i}>{formatGame(g)}</Fragment>)
            : "No upcoming games in the next 7 days"}
        </List>
      </CardContent>
    </Card>
  );
}
