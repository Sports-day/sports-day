"use client";

import { Box, Card, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useState } from "react";

type WarnProps = {
  warncomment: string;
};

export default function Warning({ warncomment }: WarnProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: "16px",
        width: "100%",
      }}
    >
      <Card
        variant="outlined"
        sx={{
          background: "#FFFFFF",
          borderColor: "#E68A00",
          borderWidth: "1.5px",
          borderRadius: "12px",
          width: "100%",
          px: "16px",
          py: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <WarningAmberIcon
            sx={{ color: "#E68A00", fontSize: 20, flexShrink: 0 }}
          />
          <Typography
            sx={{
              fontWeight: 500,
              fontSize: "14px",
              color: "#E68A00",
              lineHeight: 1.6,
              flexGrow: 1,
              minWidth: 0,
            }}
          >
            {warncomment}
          </Typography>
          <IconButton
            size="small"
            onClick={() => setVisible(false)}
            sx={{
              color: "#5B6DC6",
              flexShrink: 0,
              p: "4px",
              "&:hover": { backgroundColor: "rgba(91, 109, 198, 0.1)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Card>
    </Box>
  );
}
