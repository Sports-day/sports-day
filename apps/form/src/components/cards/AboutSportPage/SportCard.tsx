import {
  Box,
  Card,
  Typography,
  Stack,
  CardActionArea,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
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
    <Link
      to={`/weather/${type}/sport/${sportId}`}
      style={{ display: "block", width: "100%" }}
    >
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 150 }}
      >
        <Card
          sx={{
            background: theme.palette.card.main,
            height: "100%",
            width: "100%",
            borderRadius: "10px",
            p: "4px",
          }}
          component="div"
        >
          <CardActionArea sx={{ width: "100%", height: "100%" }}>
            <Stack
              direction="row"
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 88, sm: 104, md: 120 },
                px: "8px",
              }}
            >
              {hasTeam && (
                <Box
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "1.5px solid #fff",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    lineHeight: 1,
                    mr: "6px",
                    flexShrink: 0,
                  }}
                >
                  ✓
                </Box>
              )}
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
