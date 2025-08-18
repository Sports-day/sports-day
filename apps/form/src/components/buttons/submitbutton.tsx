"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";

export default function SubmitButton() {
  return (
    <Link href={{ pathname: "/submit/finished" }} passHref>
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          sx={{
            color: "#5B6DC6",
            background: "white",
            width: "100%",
            borderRadius: "10px",
            "&:hover": {
              color: "#5B6DC6",
              background: "white",

              opacity: 0.6,
            },
          }}
        >
          提出
        </Button>
      </motion.div>
    </Link>
  );
}
