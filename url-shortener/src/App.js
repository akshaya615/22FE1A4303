import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";

import ShortenerPage from "./pages/ShortenerPage";
import StatsPage from "./pages/StatsPage";
import RedirectHandler from "./pages/RedirectHandler";

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>TinyLink — URL Shortener</Typography>
          <Button color="inherit" component={Link} to="/"><HomeIcon sx={{ mr: 1 }} /> Shorten</Button>
          <Button color="inherit" component={Link} to="/stats"><BarChartIcon sx={{ mr: 1 }} /> Stats</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ mt: 2 }}>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/r/:code" element={<RedirectHandler />} />
          <Route path="/:code" element={<RedirectHandler />} />
        </Routes>
      </Box>
    </Router>
  );
}
