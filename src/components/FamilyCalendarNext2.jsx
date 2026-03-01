import { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const PROXY_URL = import.meta.env.VITE_WORKER_URL;
const API_KEY = import.meta.env.VITE_WORKER_KEY;
const ICS_URL = import.meta.env.VITE_ICS_URL;

// ------------------------------------------------------------
// ICS PARSER
// ------------------------------------------------------------
function parseICSEvents(icsText) {
  const events = [];
  const blocks = icsText.split("BEGIN:VEVENT").slice(1);

  for (const block of blocks) {
    const endIndex = block.indexOf("END:VEVENT");
    const vevent = block.slice(0, endIndex);

    const getLine = (prop) => {
      const regex = new RegExp(`^${prop}.*:(.*)$`, "m");
      const match = vevent.match(regex);
      return match ? match[1].trim() : null;
    };

    const dtStartRaw = getLine("DTSTART");
    const dtEndRaw = getLine("DTEND");
    const summary = getLine("SUMMARY") || "(No title)";

    if (!dtStartRaw) continue;

    let start,
      end,
      allDay = false;

    // All-day event (YYYYMMDD)
    if (/^\d{8}$/.test(dtStartRaw)) {
      allDay = true;
      const year = Number(dtStartRaw.slice(0, 4));
      const month = Number(dtStartRaw.slice(4, 6));
      const day = Number(dtStartRaw.slice(6, 8));
      start = Temporal.PlainDate.from({ year, month, day });

      if (dtEndRaw && /^\d{8}$/.test(dtEndRaw)) {
        const eYear = Number(dtEndRaw.slice(0, 4));
        const eMonth = Number(dtEndRaw.slice(4, 6));
        const eDay = Number(dtEndRaw.slice(6, 8));
        end = Temporal.PlainDate.from({
          year: eYear,
          month: eMonth,
          day: eDay,
        }).subtract({ days: 1 });
      } else {
        end = start;
      }
    } else {
      // Timed event
      const parseDateTime = (raw) => {
        const clean = raw.replace("Z", "");
        const year = Number(clean.slice(0, 4));
        const month = Number(clean.slice(4, 6));
        const day = Number(clean.slice(6, 8));
        const hour = Number(clean.slice(9, 11) || 0);
        const minute = Number(clean.slice(11, 13) || 0);
        const second = Number(clean.slice(13, 15) || 0);
        return Temporal.PlainDateTime.from({
          year,
          month,
          day,
          hour,
          minute,
          second,
        });
      };

      start = parseDateTime(dtStartRaw);
      end = dtEndRaw ? parseDateTime(dtEndRaw) : start;
      allDay = false;
    }

    events.push({ summary, start, end, allDay });
  }

  return events;
}

// ------------------------------------------------------------
// FILTERING + GROUPING (Today + Tomorrow only)
// ------------------------------------------------------------
function isWithinNext2Days(event, today) {
  const tomorrow = today.add({ days: 1 });


  if (event.allDay) {
    return (
      Temporal.PlainDate.compare(event.end, today) >= 0 &&
      Temporal.PlainDate.compare(event.start, tomorrow) <= 0
    );
  } else {
    const eventDate = event.start.toPlainDate();
    return (
      Temporal.PlainDate.compare(eventDate, today) >= 0 &&
      Temporal.PlainDate.compare(eventDate, tomorrow) <= 0
    );
  }
}

function groupEventsByDay(events, today) {
  const groups = new Map();
  const tomorrow = today.add({ days: 1 });

  for (const event of events) {
    if (event.allDay) {
      let current = event.start;
      while (Temporal.PlainDate.compare(current, event.end) <= 0) {
        if (
          Temporal.PlainDate.compare(current, today) === 0 ||
          Temporal.PlainDate.compare(current, tomorrow) === 0
        ) {
          const key = current.toString();
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push({ ...event, displayDate: current });
        }
        current = current.add({ days: 1 });
      }
    } else {
      const date = event.start.toPlainDate();
      if (
        Temporal.PlainDate.compare(date, today) === 0 ||
        Temporal.PlainDate.compare(date, tomorrow) === 0
      ) {
        const key = date.toString();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ ...event, displayDate: date });
      }
    }
  }

  const keys = [today.toString(), tomorrow.toString()];
  for (const key of keys) if (!groups.has(key)) groups.set(key, []);
  return keys.map((key) => ({
    date: Temporal.PlainDate.from(key),
    events: groups.get(key),
  }));
}

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------
export default function FamilyCalendarNext2() {
  const [days, setDays] = useState([]);
  const [error, setError] = useState(null);
  const midnightTimeoutRef = useRef(null);

  const fetchAndProcess = async () => {
    try {
      setError(null);

      if (!ICS_URL) {
        setError("ICS URL is not configured.");
        return;
      }

      const res = await fetch(
        `${PROXY_URL}/cors?url=${encodeURIComponent(ICS_URL)}`,
        { headers: { "x-autisticgeek-key": API_KEY } }
      );

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const text = await res.text();
      const allEvents = parseICSEvents(text);
      const today = Temporal.Now.plainDateISO();

      const upcoming = allEvents.filter((e) => isWithinNext2Days(e, today));

      const grouped = groupEventsByDay(upcoming, today);
      setDays(grouped);
    } catch (e) {
      console.error(e);
      setError("Unable to load calendar.");
    }
  };

  const scheduleMidnightUpdate = () => {
    const now = Temporal.Now.plainDateTimeISO();
    const tomorrowMidnight = now
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const msUntilMidnight = tomorrowMidnight
      .since(now, { smallestUnit: "millisecond" })
      .total("millisecond");

    midnightTimeoutRef.current = setTimeout(() => {
      fetchAndProcess();
      scheduleMidnightUpdate();
    }, msUntilMidnight);
  };

  useEffect(() => {
    fetchAndProcess();
    scheduleMidnightUpdate();
    return () => clearTimeout(midnightTimeoutRef.current);
  }, []);

  const formatDayLabel = (date) => {
    const today = Temporal.Now.plainDateISO();
    const cmp = Temporal.PlainDate.compare(date, today);
    if (cmp === 0) return "Today";
    if (cmp === 1) return "Tomorrow";
    return date.toLocaleString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  // --- UPDATED formatTime ---
  const formatTime = (event) => {
    if (event.allDay) return "All day";

    const dt = event.start;
    if (dt instanceof Temporal.PlainDateTime) {
      let hour = dt.hour;
      const minute = dt.minute.toString().padStart(2, "0");
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12 || 12;
      return `${hour}:${minute} ${ampm}`;
    }

    return "Time not specified";
  };

  return (
    <Card elevation={1} sx={{ p: 2 }}>
      <CardHeader title="Today & Tomorrow" />
      <CardContent>
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 1 }}>
            {error}
          </Typography>
        )}

        {days.map((day, index) => (
          <div key={day.date.toString()}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, mt: index === 0 ? 0 : 2 }}
            >
              {formatDayLabel(day.date)}
            </Typography>

            {day.events.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Nothing scheduled
              </Typography>
            ) : (
              <List dense>
                {day.events.map((event, i) => (
                  <ListItem key={i} disableGutters>
                    <ListItemText
                      primary={event.summary}
                      secondary={formatTime(event)}
                    />
                  </ListItem>
                ))}
              </List>
            )}

            {index < days.length - 1 && <Divider sx={{ mt: 1 }} />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
