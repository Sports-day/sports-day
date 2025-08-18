"use client";

import { Toolbar, Card, Typography, Button, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WarningIcon from "@mui/icons-material/Warning";
import { useState } from "react";

type warnProps = {
  warncomment: string;
};

export default function Warning({ warncomment }: warnProps) {
  const [visiable, setVisible] = useState(true);
  const handleClose = () => {
    setVisible(false);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        my: "1%",
        width: "100%",
        height: "100%",
      }}
    >
      {visiable && (
        <Card
          variant="outlined"
          sx={{
            borderColor: "#A27B1D",
            background: "#FDF5DE",
            width: "60%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", m: "1%" }}>
            <WarningIcon sx={{ color: "#A27B1D", mr: "3%" }} />
            <Typography
              sx={{
                color: "#A27B1D",
                justifyContent: "flex-start",
                flexGrow: 1,
              }}
            >
              {warncomment}
            </Typography>
            <Button onClick={handleClose}>
              <CloseIcon sx={{ color: "#A27B1D" }} />
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}
