"use client";

import { Toolbar, Box } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";

export default function Header() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        background: theme.palette.background.default,
        width: "100%",
        minHeight: { xs: 64, md: 72 },
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "flex-start", width: "100%", px: { xs: "16px", md: "32px" } }}>
        <Image
          src="/images/logo_form.png"
          alt=""
          width={400}
          height={20}
          style={{ width: "clamp(180px, 42vw, 360px)", height: "auto" }}
        />
      </Toolbar>
    </Box>
  );
}
