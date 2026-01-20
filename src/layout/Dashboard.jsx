import { Container, Paper, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import CountdownTimer from "../components/CountdownTimer.jsx";
import { nanoid } from "nanoid";
import HourlyTempChart from "../components/HourlyTempChart.jsx";
import StaticCountdown from "../components/StaticCountdown.jsx";
import RandomPokemonCard from "../components/RandomPokemonCard.jsx";
import EDMAudioCard from "../components/EDMAudioCard.jsx";
import { ByuScheduleCard } from "../components/ByuScheduleCard.jsx";
import NeonClock from "../components/NeonClock.jsx";

// Default module registry
const modules = [
  { id: nanoid(), component: CountdownTimer, props: {} },
  {
    id: nanoid(),
    component: StaticCountdown,
    props: { month: 12, day: 17, title: "Joshua’s Birthday" },
  },
  { id: nanoid(), component: HourlyTempChart, props: {} },
  {
    id: nanoid(),
    component: RandomPokemonCard,
    props: {},
  },
  {
    id: nanoid(),
    component: EDMAudioCard,
    props: {},
  },
  {
    id: nanoid(),
    title: "BYU Upcoming Games",
    component: ByuScheduleCard,
  },
  {
    id: nanoid(),
    title: "Clock",
    component: NeonClock,
  },
];

export default function Dashboard() {
  return (
    <Container sx={{ pt: 2 }} maxWidth="xl">
      <Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
        {modules
          // .sort((a, b) => a.order - b.order)
          // eslint-disable-next-line no-unused-vars
          .map(({ id, component: Component, props }) => (
            <Component key={id} id={id} {...props} />
          ))}
      </Masonry>
    </Container>
  );
}
