import React, { useEffect, useState } from "react";
import {
  Container, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  TableContainer, IconButton, Box, Button, Snackbar, Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import store from "../lib/store";
import logger from "../lib/logger";

export default function StatsPage() {
  const [links, setLinks] = useState(Object.values(store.getAll()).sort((a, b) => b.createdAt - a.createdAt));
  const [logs, setLogs] = useState(logger.getAll());
  const [snack, setSnack] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    logger.log("page_view", "Stats page loaded");
  }, []);

  const refresh = () => {
    setLinks(Object.values(store.getAll()).sort((a, b) => b.createdAt - a.createdAt));
    setLogs(logger.getAll());
  };

  const handleDelete = (code) => {
    store.remove(code);
    logger.log("link_deleted", "Link removed by user", { code });
    setSnack({ open: true, severity: "info", message: "Deleted" });
    refresh();
  };

  const clearLogs = () => {
    logger.clear();
    setLogs([]);
    setSnack({ open: true, severity: "info", message: "Logs cleared" });
  };

  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h6" gutterBottom>Shortened Links — Statistics</Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Shortcode</TableCell>
                <TableCell>Original URL</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Expires</TableCell>
                <TableCell>Clicks</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {links.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">No links yet.</TableCell>
                </TableRow>
              )}
              {links.map((l) => (
                <TableRow key={l.code}>
                  <TableCell><Link to={`/r/${encodeURIComponent(l.code)}`}>{l.code}</Link></TableCell>
                  <TableCell sx={{ maxWidth: 250, overflow: "hidden", textOverflow: "ellipsis" }}>{l.url}</TableCell>
                  <TableCell>{new Date(l.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{l.expiresAt ? new Date(l.expiresAt).toLocaleString() : "Never"}</TableCell>
                  <TableCell>{l.clicks || 0}</TableCell>
                  <TableCell><IconButton onClick={() => handleDelete(l.code)}><DeleteIcon /></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
        <Typography variant="h6">Application Logs</Typography>
        <Button variant="outlined" onClick={refresh}>Refresh</Button>
        <Button variant="outlined" color="error" onClick={clearLogs}>Clear Logs</Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        {logs.length === 0 ? <Typography variant="body2">No logs yet.</Typography> :
          logs.map((log) => (
            <Paper key={log.id} sx={{ p: 1, mb: 1 }}>
              <Typography variant="caption">{new Date(log.ts).toLocaleString()} • {log.eventType}</Typography>
              <Typography variant="body2">{log.message}</Typography>
              <Typography variant="caption">{JSON.stringify(log.meta)}</Typography>
            </Paper>
          ))
        }
      </Paper>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Container>
  );
}
