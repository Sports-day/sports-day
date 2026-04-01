import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { motion } from "framer-motion";
import { useTheme, Typography } from "@mui/material";

export default function SubmitButton() {
  const theme = useTheme();
  return (
    <Link to="/submit">
      <motion.div whileTap={{ scale: 0.98 }}>
        <Button
          component="span"
          sx={{
            background: theme.palette.button.veryLight,
            width: "100%",
            px: "4px",
            py: "8px",
            borderRadius: "10px",
            "&:hover": {
              background: theme.palette.button.veryLight,
              width: "100%",
              px: "4px",
              py: "8px",
              borderRadius: "10px",
              opacity: 0.6,
            },
          }}
        >
          <Typography
            sx={(theme) => ({
              ...theme.typography.buttonFont2,
            })}
          >
            提出
          </Typography>
        </Button>
      </motion.div>
    </Link>
  );
}
