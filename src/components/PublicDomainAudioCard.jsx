// src/components/PublicDomainAudioCard.jsx
import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Typography,
  Paper,
  Button,
} from "@mui/material";

export default function PublicDomainAudioCard() {
  const [playlist, setPlaylist] = useState([]);
  const [index, setIndex] = useState(0);
  const audioRef = useRef(null);

  const track = playlist[index];

  // Load playlist once
  useEffect(() => {
    fetch("/music/playlist.json")
      .then((res) => res.json())
      .then((data) => setPlaylist(data.tracks || []))
      .catch((err) => console.error("Playlist load failed:", err));
  }, []);

  // When index changes → play new track
  useEffect(() => {
    if (!audioRef.current || !track) return;

    audioRef.current.src = track.audio;
    audioRef.current.play().catch(() => {});
  }, [index, track]);

  const handleEnded = () => {
    setIndex((prev) => (prev + 1) % playlist.length);
  };

  const copyAttribution = () => {
    if (!track?.attribution) return;
    navigator.clipboard.writeText(track.attribution);
  };

  return (
    <Paper elevation={1}>
      <Card elevation={1} sx={{ p: 2, textAlign: "center", minHeight: 350 }}>
        <CardHeader
          title="Stream Safe Music"
          subheader="CC0 / Creative Commons / YouTube Audio Library"
        />

        {track?.artwork && (
          <CardMedia
            component="img"
            image={track.artwork}
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

          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            {track?.artist}
          </Typography>

          {track?.source?.platform && (
            <Typography variant="caption" sx={{ display: "block", mb: 1 }}>
              Source: {track.source.platform.toUpperCase()}
            </Typography>
          )}

          <Typography variant="caption" sx={{ display: "block", mb: 2 }}>
            License: {track?.license?.type}
          </Typography>

          {track?.attribution && (
            <Button size="small" onClick={copyAttribution}>
              Copy Attribution
            </Button>
          )}

          <audio
            ref={audioRef}
            controls
            onEnded={handleEnded}
            style={{ width: "100%", marginTop: "8px" }}
          />
        </CardContent>
      </Card>
    </Paper>
  );
}
