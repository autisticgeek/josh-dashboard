import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { Paper, Box, Card, CardContent, CardHeader } from "@mui/material";

export default function HourlyTempChart() {
  const HOURS_TO_SHOW = 11;

  const [hours, setHours] = useState([]);
  const [tempsC, setTempsC] = useState([]);

  useEffect(() => {
    async function loadWeather() {
      const pointRes = await fetch(
        "https://api.weather.gov/points/40.32393,-111.713782"
      );
      const pointData = await pointRes.json();

      const hourlyUrl = pointData.properties.forecastHourly;

      const hourlyRes = await fetch(hourlyUrl);
      const hourlyData = await hourlyRes.json();

      const periods = hourlyData.properties.periods.slice(0, HOURS_TO_SHOW);

      const hourLabels = periods.map((p) =>
        new Date(p.startTime).toLocaleTimeString([], { hour: "numeric" })
      );

      const tempsInC = periods.map((p) => ((p.temperature - 32) * 5) / 9);

      setHours(hourLabels);
      setTempsC(tempsInC);
    }

    loadWeather();
    const interval = setInterval(loadWeather, 600_000);
    return () => clearInterval(interval);
  }, []);

  const xValues = hours.map((_, i) => i);

  return (
    <Paper elevation={1}>
      <Card sx={{ p: 2, textAlign: "center", minHeight: 220 }}>
        <CardHeader title="Tempature" />
        <CardContent>
          <LineChart
            loading={tempsC.length === 0}
            height={180}
            grid={{ vertical: true, horizontal: true }}
            disableAxisListener
            xAxis={[
              {
                data: xValues,
                valueFormatter: (i) => hours[i],
              },
            ]}
            yAxis={[
              {
                width: 40, // compact for Masonry
                valueFormatter: (c) => `${c.toFixed(0)}°`,
              },
            ]}
            series={[
              {
                data: tempsC,
                showMark: false,
                color: "#1976d2",
              },
            ]}
          />
        </CardContent>
      </Card>
    </Paper>
  );
}
