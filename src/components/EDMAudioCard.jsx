import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Paper,
} from "@mui/material";

const PROXY_URL = import.meta.env.VITE_WORKER_URL;
const API_KEY = import.meta.env.VITE_WORKER_KEY;

export default function SomaFMAudioCard() {
  const STREAM_URL = `${PROXY_URL}/stream`;
  const META_URL = `${PROXY_URL}/cors?url=https://api.somafm.com/channels.json`;

  const [track, setTrack] = useState(null);
  const [artwork, setArtwork] = useState(null);

  async function fetchMetadata() {
    try {
      const res = await fetch(META_URL, {
        headers: {
          "x-autisticgeek-key": API_KEY,
        },
      });
      const data = await res.json();

      // Find the Dub Step Beyond channel
      const channel = data.channels.find((c) => c.title === "Dub Step Beyond");

      if (!channel || !channel.lastPlaying) {
        setTrack({ artist: "Unknown", title: "Unknown" });
        setArtwork(null);
        return;
      }

      // SomaFM gives "Artist - Track"
      const nowPlaying = channel.lastPlaying;
      const [artist, title] = nowPlaying.split(" - ");

      setTrack({
        artist: artist || "Unknown Artist",
        title: title || "Unknown Track",
      });

      // Fetch artwork from iTunes Search API
      const itunesUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(
        nowPlaying
      )}&entity=song&limit=1`;
      const itunesRes = await fetch(
        `${PROXY_URL}/cors?url=${encodeURIComponent(itunesUrl)}`,
        {
          headers: {
            "x-autisticgeek-key": API_KEY,
          },
        }
      );

      const itunesData = await itunesRes.json();

      if (
        itunesData.results?.length > 0 &&
        itunesData.results[0].kind === "song"
      ) {
        setArtwork(
          itunesData.results[0].artworkUrl100.replace("100x100", "600x600")
        );
      } else {
        setArtwork(channel?.xlimage || channel?.largeimage || null);
      }
    } catch (err) {
      console.error("Metadata fetch failed:", err);
    }
  }

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 30_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Paper elevation={1}>
      <Card elevation={1} sx={{ p: 2, textAlign: "center", minHeight: 350 }}>
        <CardHeader title="Dub Step Beyond" subheader="SomaFM" />

        {artwork && (
          <CardMedia
            component="img"
            image={artwork}
            alt="Album Art"
            sx={{
              width: "70%",
              margin: "0 auto",
              objectFit: "cover",
              borderRadius: 2,
              mb: 2,
            }}
          />
        )}

        <CardContent>
          <Typography variant="h6">
            {track ? track.title : "Loading…"}
          </Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {track ? track.artist : ""}
          </Typography>

          <audio
            controls
            src={STREAM_URL}
            style={{ width: "100%", marginTop: "8px" }}
          />
        </CardContent>
      </Card>
    </Paper>
  );
}
