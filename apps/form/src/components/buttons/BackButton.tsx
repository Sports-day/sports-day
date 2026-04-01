"use client";

import { Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

export default function BackButton() {
  const theme = useTheme();
  const router = useRouter();
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Button
        onClick={() => router.back()}
        sx={{
          background: theme.palette.button.main,
          borderRadius: "10px",
          width: "100%",
          px: "4px",
          py: "8px",
          "&:hover": {
            background: theme.palette.button.main,
            borderRadius: "10px",
            width: "100%",
            px: "4px",
            py: "8px",
            opacity: 0.6,
          },
        }}
      >
        <Typography
          sx={(theme) => ({
            ...theme.typography.buttonFont1,
          })}
        >
          戻る
        </Typography>
      </Button>
    </motion.div>
  );
}
