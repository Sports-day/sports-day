"use client";

import { Card, Typography, Button, Box } from "@mui/material";
import { useState } from "react";

type warnProps = {
  warncomment: string;
};

export default function Warning({ warncomment }: warnProps) {
  const [visible, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mb: "16px",
        width: "100%",
      }}
    >
      {visible && (
        <Card
          variant="outlined"
          sx={{
            borderWidth: "2px",
            borderColor: "#A27B1D",
            background: "#FDF5DE",
            width: "100%",
            p: "4px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "flex-start", sm: "center" },
              flexWrap: "wrap",
              rowGap: "4px",
            }}
          >
            <Typography
              sx={{
                color: "#A27B1D",
                mr: "16px",
                ml: "16px",
                fontSize: "20px",
                lineHeight: 1,
              }}
            >
              !
            </Typography>
            <Typography
              sx={{
                fontWeight: "medium",
                fontSize: "16px",
                color: "#A27B1D",
                justifyContent: "flex-start",
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              {warncomment}
            </Typography>
            <Button aria-label="閉じる" onClick={handleClose} sx={{ ml: "auto" }}>
              <Typography
                sx={{ color: "#A27B1D", fontSize: "20px", lineHeight: 1 }}
              >
                ×
              </Typography>
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}
