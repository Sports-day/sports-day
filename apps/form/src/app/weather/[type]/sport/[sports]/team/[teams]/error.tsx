"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useEffect } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SPORTSDAY : Error",
};

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <>
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
              <Box pb={0.5}>
                {/*<Mark*/}
                {/*    width={20}*/}
                {/*    height={20}*/}
                {/*    fill={"#99a5d6"}*/}
                {/*/>*/}
              </Box>
              <Typography fontSize={"16px"} color={"#99a5d6"}>
                エラーが発生しました
              </Typography>
              <Stack spacing={"8px"} direction={"row"}>
                <ErrorOutlineIcon sx={{ color: "#99a5d6" }} />
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
    </>
  );
}
