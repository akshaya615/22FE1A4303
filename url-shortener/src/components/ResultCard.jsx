import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { QRCodeCanvas } from "qrcode.react"; // ✅ fixed import

export default function ResultCard({ originalUrl, shortUrl, expiry, onCopy }) {
  return (
    <Card sx={{ mb: 2, p: 2, boxShadow: 3 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="body1">
            <strong>Original URL:</strong> {originalUrl}
          </Typography>

          <Typography variant="body1" color="primary">
            <strong>Short URL:</strong>{" "}
            <a href={shortUrl} target="_blank" rel="noreferrer">
              {shortUrl}
            </a>
          </Typography>

          <Typography variant="body2" color="text.secondary">
            <strong>Valid until:</strong> {expiry}
          </Typography>

          <Box display="flex" alignItems="center" gap={2}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={() => onCopy(shortUrl)}
            >
              Copy
            </Button>

            {/* ✅ Using QRCodeCanvas instead of default */}
            <QRCodeCanvas value={shortUrl} size={128} />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
