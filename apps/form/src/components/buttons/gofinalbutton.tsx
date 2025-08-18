"use client";

import Button from "@mui/material/Button";
import Link from "next/link";
import { motion } from "framer-motion";

export default function GoFinal() {
  return (
    <Link href={{ pathname: "/confirm/finalconfirm" }} passHref>
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          component="span"
          sx={{
            color: "#5B6DC6",
            background: "white",
            width: "100%",
            "&:hover": {
              background: "white",
              color: "#5B6DC6",
              opacity: 0.8,
            },
          }}
        >
          確認画面に進む
        </Button>
      </motion.div>
    </Link>
  );
}
