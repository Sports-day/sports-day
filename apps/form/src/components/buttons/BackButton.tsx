import { Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";

export default function BackButton() {
  const theme = useTheme();
  const navigate = useNavigate();
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Button
        onClick={() => navigate(-1)}
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
