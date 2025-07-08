"use client";

import Toolbar from "@mui/material/Toolbar";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CloseIcon from "@mui/icons-material/Close";
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
    <div>
      {visiable && (
        <Card
          sx={{
            background: "#FDF5DE",
            border: "#A27B1D",
            mt: "3vh",
          }}
        >
          <Toolbar sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              sx={{
                color: "#A27B1D",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              {warncomment}
            </Typography>
            <Button onClick={handleClose}>
              <CloseIcon sx={{ color: "#A27B1D" }} />
            </Button>
          </Toolbar>
        </Card>
      )}
    </div>
  );
}
