"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

type ErrorFallbackProps = {
  error: Error & { digest?: string };
};

export default function ErrorFallback({ error }: ErrorFallbackProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      maxHeight={"100vh"}
      sx={{
        backgroundColor: "#23398A",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Container maxWidth={"md"}>
        <Stack
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100%"}
          height={"100vh"}
          spacing={"50px"}
        >
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"8px"}
          >
            <Typography fontSize={"30px"} color={"#fff"}>
              (Ｔ＿Ｔ)
            </Typography>
          </Stack>
          <Stack
            direction={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={"8px"}
            p={5}
            width={"100%"}
            sx={{
              border: "1px solid #99a5d6",
              borderRadius: "15px",
              borderBottomLeftRadius: "3px",
            }}
          >
            <Typography fontSize={"16px"} color={"#99a5d6"}>
              エラーが発生しました
            </Typography>
            <Stack spacing={"8px"} direction={"row"}>
              <Typography sx={{ color: "#99a5d6", fontSize: "16px", lineHeight: 1 }}>
                !
              </Typography>
              <Typography fontSize={"16px"} color={"#99a5d6"}>
                status code : see the console
              </Typography>
            </Stack>
          </Stack>
          <Button
            href={"/"}
            sx={{
              width: "100%",
              height: "fit-content",
              padding: "16px",
              backgroundColor: "#fff",
              border: "1px solid #fff",
              borderRadius: "15px",
              borderBottomLeftRadius: "3px",
            }}
          >
            <Stack
              direction={"row"}
              justifyContent={"center"}
              alignItems={"center"}
              spacing={"16px"}
            >
              <Typography sx={{ color: "#5664e3", fontSize: "16px" }}>
                トップに戻る
              </Typography>
            </Stack>
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
