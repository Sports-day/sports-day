"use client";

import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function BackButton() {
  const router = useRouter();
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Button
        onClick={() => router.back()}
        variant="contained"
        sx={{
          background: "#5B6DC6",
          borderRadius: "10px",
          width: "100%",
          "&:hover": {
            background: "#5B6DC6",
            opacity: 0.6,
          },
        }}
      >
        <Typography sx={{ color: "white" }}>戻る</Typography>
      </Button>
    </motion.div>
  );
}
