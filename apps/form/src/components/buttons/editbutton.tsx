"use client";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Link from "next/link";
import { motion } from "framer-motion";

type Props = {
  type: string;
  sports: string;
  teams: string;
};

export default function EditButton({ type, sports, teams }: Props) {
  return (
    <Link
      href={`/weather/${type}/sport/${sports}/team/teamedit?teamid=${teams}`}
    >
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          component="span"
          variant="outlined"
          sx={{
            background: "white",
            borderColor: "#E4781A",
            borderWidth: "2px",
            color: "#E4781A",
            height: "100%",
            borderRadius: "30px",
            "&:hover": {
              background: "white",
              borderColor: "#E4781A",
              borderWidth: "2px",
              color: "#E4781A",
              opacity: 0.8,
            },
          }}
        >
          <EditIcon />
          編集
        </Button>
      </motion.div>
    </Link>
  );
}
