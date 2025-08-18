"use client";

import { Card, Typography, Stack, CardActionArea } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";
import { motion } from "framer-motion";

type SportCardProps = {
  name: string;
  sportId: string;
  type: string;
  hasTeam: boolean;
};

export default function SportCard({
  name,
  sportId,
  type,
  hasTeam,
}: SportCardProps) {
  return (
    <Link href={`/weather/${type}/sport/${sportId}`} passHref>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        <Card
          style={{
            background: "#5F6DC2",
            height: "20vh",
            borderRadius: "20px",
          }}
          component="div"
        >
          <CardActionArea>
            <Stack
              direction="row"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "20vh",
              }}
            >
              {hasTeam && <CheckCircleIcon sx={{ color: "#3cff00ff" }} />}
              <Typography color="white">{name}</Typography>
            </Stack>
          </CardActionArea>
        </Card>
      </motion.div>
    </Link>
  );
}
