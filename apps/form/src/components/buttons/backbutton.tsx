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
        variant="contained"
        sx={{
          background: theme.palette.button.light,
          borderRadius: "10px",
          width: "100%",
          "&:hover": {
            background: theme.palette.button.light,
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
