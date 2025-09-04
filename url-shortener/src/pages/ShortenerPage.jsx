import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Grid, Button, Snackbar, Alert } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

import ShortenRow from "../components/ShortenRow";
import ResultCard from "../components/ResultCard";

import store from "../lib/store";
import logger from "../lib/logger";
import { isValidUrl, defaultValidityMinutesIfEmpty, minutesToMs, generateCode } from "../lib/utils";

export default function ShortenerPage() {
  const [rows, setRows] = useState([{ id: uuidv4(), url: "", minutes: "", alias: "" }]);
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });
  const [results, setResults] = useState([]);

  useEffect(() => {
    logger.log("page_view", "Shortener page opened");
  }, []);

  const addRow = () => {
    if (rows.length >= 5) {
      setSnack({ open: true, severity: "info", message: "Max 5 rows allowed" });
      return;
    }
    setRows((r) => [...r, { id: uuidv4(), url: "", minutes: "", alias: "" }]);
  };

  const removeRow = (id) => setRows((r) => r.filter((x) => x.id !== id));

  const updateRow = (id, patch) => {
    setRows((r) => r.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    logger.log("action_start", "Submitting shorten form", { rowsCount: rows.length });

    const created = [];

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (!r.url.trim()) continue;

      if (!isValidUrl(r.url.trim())) {
        setSnack({ open: true, severity: "error", message: `Row ${i + 1}: Invalid URL` });
        logger.log("validation_fail", "Invalid URL", { row: i + 1, url: r.url });
        return;
      }

      const minutes = defaultValidityMinutesIfEmpty(r.minutes);
      if (minutes === null) {
        setSnack({ open: true, severity: "error", message: `Row ${i + 1}: Validity minutes must be a positive integer` });
        logger.log("validation_fail", "Invalid minutes", { row: i + 1, minutes: r.minutes });
        return;
      }

      const alias = r.alias.trim();
      if (alias) {
        if (!/^[A-Za-z0-9_-]{3,64}$/.test(alias)) {
          setSnack({ open: true, severity: "error", message: `Row ${i + 1}: Alias invalid (A-Z a-z 0-9 _ - allowed, 3-64 chars).` });
          logger.log("validation_fail", "Invalid alias", { row: i + 1, alias });
          return;
        }
        if (store.exists(alias)) {
          setSnack({ open: true, severity: "error", message: `Row ${i + 1}: Alias already taken.` });
          logger.log("validation_fail", "Alias taken", { row: i + 1, alias });
          return;
        }
      }

      let code = alias || generateCode(7);
      while (store.exists(code)) { code = generateCode(7); }

      const item = {
        code,
        url: r.url.trim(),
        createdAt: Date.now(),
        expiresAt: minutes > 0 ? Date.now() + minutesToMs(minutes) : null,
        clicks: 0,
      };

      try {
        await store.upsert(item);
        logger.log("link_created", "Short link created", { code, url: item.url, expiresAt: item.expiresAt });
        created.push(item);
      } catch (err) {
        setSnack({ open: true, severity: "error", message: `Row ${i + 1}: Failed to create` });
        logger.log("action_error", "Failed to create link", { row: i + 1, error: err?.message ?? String(err) });
        return;
      }
    }

    if (created.length === 0) {
      setSnack({ open: true, severity: "info", message: "No URLs to shorten" });
    } else {
      setResults(created);
      setSnack({ open: true, severity: "success", message: `${created.length} short link(s) created` });
      setRows([{ id: uuidv4(), url: "", minutes: "", alias: "" }]);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnack({ open: true, severity: "success", message: "Copied to clipboard" });
      logger.log("ui_copy", "Copied short link", { text });
    } catch (err) {
      setSnack({ open: true, severity: "error", message: "Copy failed" });
      logger.log("ui_error", "Copy failed", { error: err?.message ?? String(err) });
    }
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Shorten URLs (up to 5 at once)</Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {rows.map((row, idx) => (
              <Grid item xs={12} key={row.id}>
                <ShortenRow
                  row={row}
                  index={idx}
                  onChange={updateRow}
                  onAdd={addRow}
                  onRemove={removeRow}
                  canAdd={rows.length < 5}
                  canRemove={rows.length > 1}
                />
              </Grid>
            ))}

            <Grid item xs={12}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button type="submit" variant="contained">Shorten</Button>
                <Button type="button" onClick={() => { setRows([{ id: uuidv4(), url: "", minutes: "", alias: "" }]); logger.log("ui_action", "Form reset"); }}>Reset</Button>
              </Box>
            </Grid>

            {results.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>Results</Typography>
                <Grid container spacing={2}>
                  {results.map((res) => (
                    <Grid item xs={12} md={6} key={res.code}>
                      <ResultCard item={res} onCopy={copy} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}

          </Grid>
        </Box>
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={3500} onClose={() => setSnack((s) => ({ ...s, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} sx={{ width: "100%" }}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
}
