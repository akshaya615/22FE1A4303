import React, { useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import store from "../lib/store";
import logger from "../lib/logger";

export default function RedirectHandler() {
  const { code } = useParams();

  useEffect(() => {
    logger.log("redirect_attempt", "Attempting redirect", { code });
    const rec = store.get(code);
    if (!rec) {
      logger.log("redirect_fail", "Not found", { code });
      return;
    }
    if (rec.expiresAt && rec.expiresAt <= Date.now()) {
      logger.log("redirect_fail", "Expired", { code });
      return;
    }

    // increment clicks (client store)
    try {
      store.incrementClicks(code);
    } catch (e) {
      // ignore
    }
    logger.log("redirect_success", "Redirecting to target", { code, url: rec.url });

    // use replace so back button doesn't loop
    window.location.replace(rec.url);
  }, [code]);

  const rec = store.get(code);
  if (!rec) {
    return (
      <Container sx={{ mt: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Short link not found on this device</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            The requested short code <strong>{code}</strong> does not exist in this browser's storage. This demo resolves links client-side only.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button component={Link} to="/" variant="contained">Go to Shortener</Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  if (rec.expiresAt && rec.expiresAt <= Date.now()) {
    return (
      <Container sx={{ mt: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6">Short link expired</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            This short link expired on {new Date(rec.expiresAt).toLocaleString()}.
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button component={Link} to="/" variant="contained">Go to Shortener</Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Redirecting…</Typography>
        <Typography variant="body2">If you are not redirected automatically, click below.</Typography>
        <Box sx={{ mt: 2 }}>
          <Button variant="outlined" href={rec.url} target="_blank" rel="noreferrer">Open target</Button>
        </Box>
      </Paper>
    </Container>
  );
}
