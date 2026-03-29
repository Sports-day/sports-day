"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme, Typography } from "@mui/material";

export default function GoFinal() {
  const theme = useTheme();
  return (
    <Link href={{ pathname: "/confirm/finalconfirm" }} passHref>
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          component="span"
          sx={{
            borderRadius: "10px",
            background: theme.palette.button.veryLight,
            width: "100%",
            p: "4px",
            "&:hover": {
              borderRadius: "10px",
              background: theme.palette.button.veryLight,
              width: "100%",
              p: "4px",
              opacity: 0.8,
            },
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont2,
            })}
          >
            確認画面へ
          </Typography>
        </Button>
      </motion.div>
    </Link>
  );
}
