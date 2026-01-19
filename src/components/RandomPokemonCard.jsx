import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Paper,
} from "@mui/material";

const TYPE_COLORS = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

function getContrastColor(hex) {
  // Remove leading #
  hex = hex.replace("#", "");

  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Perceived brightness formula
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 150 ? "black" : "white";
}

export default function RandomPokemonCard() {
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    async function loadRandomPokemon() {
      const randomId = Math.floor(Math.random() * 898) + 1;

      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();

      const isShiny = Math.random() < 0.05;

      setPokemon({
        name: data.name,
        image: isShiny
          ? data.sprites.other["official-artwork"].front_shiny
          : data.sprites.other["official-artwork"].front_default,
        types: data.types.map((t) => t.type.name),
        height: data.height,
        weight: data.weight,
        number: randomId,
        shiny: isShiny,
      });
    }

    loadRandomPokemon();
    const interval = setInterval(loadRandomPokemon, 300_000);
    return () => clearInterval(interval);
  }, []);

  if (!pokemon) {
    return (
      <Card elevation={1} sx={{ p: 2, textAlign: "center", minHeight: 300 }}>
        <Typography variant="h6">Loading Pokémon…</Typography>
      </Card>
    );
  }

  return (
    <Paper elevation={1}>
      <Card elevation={1} sx={{ textAlign: "center", p: 2 }}>
        <CardMedia
          component="img"
          image={pokemon.image}
          alt={pokemon.name}
          sx={{
            width: "60%",
            margin: "0 auto",
            objectFit: "contain",
            maxHeight: 200,
          }}
        />

        <CardHeader
          title={
            pokemon.name.charAt(0).toUpperCase() +
            pokemon.name.slice(1) +
            (pokemon.shiny ? " (Shiny)" : "")
          }
          subheader={`#${pokemon.number}`}
        />

        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            justifyContent="center"
            sx={{ mb: 1 }}
          >
            {pokemon.types.map((type) => {
              const bg = TYPE_COLORS[type];
              const textColor = getContrastColor(bg);
              return (
                <Chip
                  key={type}
                  label={type}
                  size="large"
                  sx={{
                    textTransform: "capitalize",
                    backgroundColor: bg,
                    color: textColor,
                    fontWeight: "bold",
                    px: 1,
                  }}
                />
              );
            })}
          </Stack>

          <Typography >
            Height: {pokemon.height / 10}m | Weight: {pokemon.weight / 10} kg
          </Typography>
        </CardContent>
      </Card>
    </Paper>
  );
}
