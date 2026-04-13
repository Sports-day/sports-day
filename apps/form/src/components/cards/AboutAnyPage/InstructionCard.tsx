"use client";

import { Box, Typography, Stack } from "@mui/material";

type InstructionProps = {
  weather: string;
  sportname: string;
};

export default function Instruction({ weather, sportname }: InstructionProps) {
  return (
    <Box>
      <Stack direction="row" spacing={"8px"}>
        <Typography sx={(theme) => ({ ...theme.typography.firstFont })}>
          {weather}
        </Typography>
        <Typography sx={(theme) => ({ ...theme.typography.firstFont })}>
          {sportname}
        </Typography>
      </Stack>
    </Box>
  );
}
