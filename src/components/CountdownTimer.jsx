import { useEffect, useRef, useState } from "react";
import { Temporal } from "@js-temporal/polyfill";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Paper,
  CardHeader,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

export default function CountdownTimer() {
  // Lazy initialization avoids setState inside effects
  const [holidayName, setHolidayName] = useState(() => {
    return localStorage.getItem("holidayName") || "";
  });

  const [holidayDate, setHolidayDate] = useState(() => {
    return localStorage.getItem("holidayDate") || "";
  });

  // Compute initial daysRemaining lazily
  const [daysRemaining, setDaysRemaining] = useState(() => {
    const storedDate = localStorage.getItem("holidayDate");
    if (!storedDate) return null;

    try {
      const target = Temporal.PlainDate.from(storedDate);
      const today = Temporal.Now.plainDateISO();
      const diff = target.since(today).days;
      return diff >= 0 ? diff : 0;
    } catch {
      return null;
    }
  });

  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDate, setEditDate] = useState("");

  const midnightTimeoutRef = useRef(null);

  // Recompute daysRemaining using Temporal
  const computeRemaining = (dateString) => {
    try {
      const target = Temporal.PlainDate.from(dateString);
      const today = Temporal.Now.plainDateISO();
      const diff = target.since(today).days;
      setDaysRemaining(diff >= 0 ? diff : 0);
    } catch {
      setDaysRemaining(null);
    }
  };

  // Schedule an update exactly at the next midnight
  const scheduleMidnightUpdate = () => {
    const now = Temporal.Now.plainDateTimeISO();
    const tomorrowMidnight = now
      .add({ days: 1 })
      .with({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    const msUntilMidnight = tomorrowMidnight
      .since(now, { smallestUnit: "millisecond" })
      .total("millisecond");

    midnightTimeoutRef.current = setTimeout(() => {
      if (holidayDate) computeRemaining(holidayDate);
      scheduleMidnightUpdate(); // schedule next midnight
    }, msUntilMidnight);
  };

  // Effect only handles async scheduling
  useEffect(() => {
    scheduleMidnightUpdate();

    return () => {
      if (midnightTimeoutRef.current) {
        clearTimeout(midnightTimeoutRef.current);
      }
    };
  }, []);

  // Dialog handlers
  const handleOpen = () => {
    setEditName(holidayName || "");
    setEditDate(holidayDate || "");
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = () => {
    localStorage.setItem("holidayName", editName);
    localStorage.setItem("holidayDate", editDate);

    setHolidayName(editName);
    setHolidayDate(editDate);
    computeRemaining(editDate);

    setOpen(false);
  };

  return (
    <>
      <Card elevation={1} sx={{ p: 2, textAlign: "center" }}>
        <CardHeader title={holidayName || "No holiday set"} />
        <CardContent>
          <Typography variant="h1">
            {daysRemaining !== null ? daysRemaining : "Set a holiday"}
          </Typography>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleOpen}>
            <SettingsIcon />
          </IconButton>
        </CardActions>
      </Card>

      {/* Dialog lives OUTSIDE the card */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Holiday</DialogTitle>

        <DialogContent>
          <Stack sx={{ gap: 2, py: 2 }}>
            <TextField
              label="Holiday Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />

            <TextField
              label="Holiday Date"
              type="date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
