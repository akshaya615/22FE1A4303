import React from "react";
import { Grid, TextField, IconButton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ShortenRow({ row, index, onChange, onAdd, onRemove, canAdd, canRemove }) {
  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <TextField
          label={`Original URL (row ${index + 1})`}
          fullWidth
          value={row.url}
          onChange={(e) => onChange(row.id, { url: e.target.value })}
          placeholder="https://example.com/path?query=1"
          required
        />
      </Grid>
      <Grid item xs={6} md={3}>
        <TextField
          label="Validity (minutes)"
          fullWidth
          value={row.minutes}
          onChange={(e) => onChange(row.id, { minutes: e.target.value })}
          placeholder="30"
          inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
        />
      </Grid>
      <Grid item xs={6} md={2}>
        <TextField
          label="Preferred shortcode (optional)"
          fullWidth
          value={row.alias}
          onChange={(e) => onChange(row.id, { alias: e.target.value })}
          placeholder="my-alias"
        />
      </Grid>
      <Grid item xs={12} md={1}>
        <Stack direction="row">
          <IconButton color="primary" onClick={onAdd} disabled={!canAdd} size="large">
            <AddIcon />
          </IconButton>
          {canRemove && (
            <IconButton color="error" onClick={() => onRemove(row.id)} size="large">
              <RemoveIcon />
            </IconButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
