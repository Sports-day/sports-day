import { Stack, Button, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";

export type weatherProps = {
  type: string;
  name: string;
  id?: string;
};

export default function SeeButton({ type, name, id }: weatherProps) {
  const same = type === id;
  const theme = useTheme();
  return (
    <Link href={`/weather/${type}`} passHref>
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="outlined"
          component="span"
          size="small"
          sx={{
            maxWidth: "100%",
            minWidth: "auto",
            height: "100%",
            borderColor: theme.palette.button.main,
            borderRadius: "30px",
            borderWidth: "2px",
            background: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            ...(same && {
              background: theme.palette.button.main,
              borderColor: theme.palette.button.main,
            }),
            "&:hover": same
              ? {
                  background: theme.palette.button.main,
                  borderColor: theme.palette.button.main,
                  borderRadius: "30px",
                  borderWidth: "2px",
                  opacity: 0.6,
                }
              : {
                  borderColor: theme.palette.button.main,
                  borderRadius: "30px",
                  borderWidth: "2px",
                  background: "none",
                  opacity: 0.6,
                },
          }}
        >
          <Stack
            display="flex"
            direction="row"
            alignItems="center"
            justifyContent="center"
            sx={{ px: "4px", width: "100%" }}
          >
            <Typography
              sx={{
                color: same
                  ? theme.typography.buttonFont1.color
                  : theme.typography.buttonFont2.color,
              }}
            >
              {name}
            </Typography>
          </Stack>
        </Button>
      </motion.div>
    </Link>
  );
}
