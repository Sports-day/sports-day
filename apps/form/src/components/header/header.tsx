"use client";

import { Toolbar, Box } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const theme = useTheme();
  return (
    <Box
      style={{
        background: theme.palette.background.default,
        width: "100%",
        height: "10%",
        position: "relative",
      }}
    >
      <Toolbar
        style={{ justifyContent: "flex-start", width: "10%", height: "100%" }}
      >
        <Image src="/images/logo_form.png" alt="" width={400} height={20} />
      </Toolbar>
    </Box>
  );
}
