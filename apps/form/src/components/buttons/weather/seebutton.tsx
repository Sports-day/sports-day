import { Stack, Button, Typography } from "@mui/material";
import Link from "next/link";
import { motion } from "framer-motion";

export type weatherProps = {
  type: string;
  name: string;
  id?: string;
};

export default function SeeButtom({ type, name, id }: weatherProps) {
  const same = type === id;
  return (
    <Link href={`/weather/${type}`} passHref>
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="outlined"
          component="span"
          sx={{
            maxWidth: "100%",
            borderColor: "#5F6DC2",
            borderRadius: "30px",
            borderWidth: "2px",
            background: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: "1%",
            m: "3%",
            ...(same && {
              background: "#5F6DC2",
              borderColor: "#5F6DC2",
            }),
            "&:hover": same
              ? {
                  background: "#5F6DC2",
                  borderColor: "#5F6DC2",
                  borderRadius: "30px",
                  borderWidth: "2px",
                  opacity: 0.6,
                }
              : {
                  borderColor: "#5F6DC2",
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
          >
            <Typography sx={{ color: same ? "white" : "#5F6DC2" }}>
              {name}
            </Typography>
          </Stack>
        </Button>
      </motion.div>
    </Link>
  );
}
