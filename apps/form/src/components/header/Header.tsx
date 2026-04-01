"use client";

import { Toolbar, Box } from "@mui/material";
import Image from "next/image";
import { useTheme } from "@mui/material/styles";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const theme = useTheme();
  const { type } = useParams() as { type: string };
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
      <Toolbar
        sx={{
          justifyContent: "flex-start",
          width: "100%",
          px: { xs: "16px", md: "32px" },
        }}
      >
        <Link href={`/weather/${type}`} passHref>
          <Image
            src="/images/logo_form.png"
            alt=""
            width={260}
            height={15}
            style={{ width: "clamp(150px, 34vw, 300px)", height: "auto" }}
          />
        </Link>
      </Toolbar>
    </Box>
  );
}
