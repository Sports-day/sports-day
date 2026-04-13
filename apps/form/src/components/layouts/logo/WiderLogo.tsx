"use client";
import Box from "@mui/material/Box";
import widerlogotype from "@/assets/widerlogotype.svg";

export default function WiderLogo() {
  return (
    <Box
      component="img"
      src={widerlogotype}
      alt="WIDER"
      sx={{ width: 80 * 1.5, height: 13 * 1.5 }}
    />
  );
}
