import { Container, Paper, Typography } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import CountdownTimer from "../components/CountdownTimer.jsx";
import { nanoid } from "nanoid";
import HourlyTempChart from "../components/HourlyTempChart.jsx";

// Default module registry
const modules = [
  { id: nanoid(), component: CountdownTimer },
  { id: nanoid(), component: HourlyTempChart },
];

export default function Dashboard() {
  return (
    // <Container sx={{ pt: 2 }}>
    <Masonry columns={4} spacing={2} sx={{ p: 2 }}>
      {modules
        .sort((a, b) => a.order - b.order)
        // eslint-disable-next-line no-unused-vars
        .map(({ id, component: Component, order }) => (
          <Component key={id} id={id} />
        ))}
    </Masonry>
    // </Container>
  );
}
