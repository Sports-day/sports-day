"use client";

import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      variant="contained"
      sx={{ background: "#5B6DC6", borderRadius: "10px" }}
    >
      <Typography sx={{ color: "white" }}>戻る</Typography>
    </Button>
  );
}
