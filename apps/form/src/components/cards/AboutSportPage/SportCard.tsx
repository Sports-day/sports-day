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
  imageUrl: string | null;
};

function SportIcon({ imageUrl }: { imageUrl: string | null }) {
  const theme = useTheme();

  if (imageUrl) {
    return (
      <Box
        component="img"
        src={imageUrl}
        alt=""
        sx={{
          width: 48,
          height: 48,
          objectFit: "contain",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <Box
      sx={{
        width: 48,
        height: 48,
        borderRadius: "8px",
        flexShrink: 0,
        bgcolor: "rgba(255,255,255,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "rgba(255,255,255,0.3)",
        fontSize: "24px",
      }}
    >
      ?
    </Box>
  );
}

export default function SportCard({
  name,
  sportId,
  type,
  hasTeam,
  imageUrl,
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
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: { xs: 120, sm: 136, md: 152 },
                px: "8px",
                py: "12px",
                gap: "8px",
              }}
            >
              <SportIcon imageUrl={imageUrl} />
              <Stack
                direction="row"
                sx={{ alignItems: "center", justifyContent: "center" }}
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
            </Stack>
          </CardActionArea>
        </Card>
      </motion.div>
    </Link>
  );
}
