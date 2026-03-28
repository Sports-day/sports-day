"use client";

import {
  Card,
  Typography,
  Stack,
  CardActionArea,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();
  return (
    <Link href={`/weather/${type}/sport/${sportId}`} passHref>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        <Card
          style={{
            background: theme.palette.card.main,
            height: "100%",
            borderRadius: "20px",
          }}
          component="div"
        >
          <CardActionArea>
            <Stack
              direction="row"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 88, sm: 104, md: 120 },
                px: 1,
              }}
            >
              {hasTeam && <CheckCircleIcon sx={{ color: "#3cff00ff" }} />}
              <Typography
                sx={(theme) => ({
                  ...theme.typography.secondFont,
                })}
              >
                {name}
              </Typography>
            </Stack>
          </CardActionArea>
        </Card>
      </motion.div>
    </Link>
  );
}
