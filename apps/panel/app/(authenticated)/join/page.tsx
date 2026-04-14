import { motion } from "framer-motion";
import { Navigation } from "@/components/layouts/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import * as React from "react";
import { HiUsers } from "react-icons/hi2";
import { FaGithubAlt } from "react-icons/fa";

export default function JoinPage() {
  return (
    <>
      <motion.div
        key={"join"}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 0.5, ease: "easeOut" }}
      >
        <Navigation />
        <Box
          component={"main"}
          minHeight={"96vh"}
          sx={{
            flexGrow: 1,
            pb: 16,
            overflowX: "hidden",
          }}
        >
          <motion.div
            key={"mainvisual"}
            initial={{ y: "-70vh" }}
            animate={{ y: "0px" }}
            exit={{ y: "-70vh" }}
            transition={{
              delay: 0.5,
              duration: 1.1,
              ease: [0.83, 0, 0.17, 1],
            }}
          >
            <Container maxWidth={false} disableGutters>
              <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={3}
                sx={{
                  paddingTop: 5,
                  paddingBottom: "0px",
                  marginBottom: "70px",
                  position: "relative",
                  zIndex: 1,
                  width: "101vw",
                  height: "62vh",
                  background: "linear-gradient(#23398A, #08174B)",
                }}
              >
                <motion.div
                  key={"join-content"}
                  initial={{ opacity: 0, y: "50px" }}
                  animate={{ opacity: 1, y: "0px" }}
                  transition={{ delay: 1.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Stack
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    spacing={1}
                    sx={{
                      pt: 7,
                      pb: 16,
                      px: 3,
                    }}
                  >
                    <Stack direction={"row"} alignItems={"center"} spacing={1}>
                      <SvgIcon sx={{ margin: 0.7 }}>
                        <HiUsers color={"#fff"} />
                      </SvgIcon>
                      <Typography sx={{ color: "#e8ebf8", fontSize: "24px" }}>
                        Join The Team
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ color: "#e8ebf8", fontSize: { xs: "32px", sm: "42px" }, fontWeight: 700 }}
                      textAlign={"center"}
                    >
                      SPORTSDAYの開発者になりませんか？
                    </Typography>
                    <Typography
                      sx={{ color: "#e8ebf8cc", fontSize: "16px", maxWidth: "720px" }}
                      textAlign={"center"}
                    >
                      SPORTSDAYをより良くしていく仲間を募集しています。興味があればフォームから連絡してください。プロジェクトの雰囲気を知りたい場合は GitHub もそのまま見られます。
                    </Typography>
                  </Stack>
                </motion.div>
              </Stack>
            </Container>
            <Container
              maxWidth={false}
              sx={{
                width: "140vw",
                height: "100px",
                left: "-20vw",
                top: "-150px",
                zIndex: "0",
                position: "relative",
                backgroundColor: "#08174B",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                borderBottomLeftRadius: "50% 50%",
                borderBottomRightRadius: "50% 50%",
              }}
            />
          </motion.div>

          <Container maxWidth={"md"} sx={{ px: 2, mt: "-56px", mb: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: "50px" }}
              animate={{ opacity: 1, y: "0px" }}
              transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <Card sx={{ width: "100%" }}>
                <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
                  <Stack spacing={3}>
                    <Typography fontSize={"18px"} fontWeight={600}>
                      開発参加はこちら
                    </Typography>
                    <Typography fontSize={"16px"}>
                      フォーム回答後、必要に応じて開発チームから連絡します。まずは雰囲気だけ見たい場合は GitHub を確認してください。
                    </Typography>
                    <Button
                      sx={{ width: "100%" }}
                      variant={"contained"}
                      color={"info"}
                      href={
                        "https://forms.office.com/Pages/ResponsePage.aspx?id=XYP-cpVeEkWK4KezivJfyNfX7_ygdxFHiwRmiJgWek1URUZOQ1JYTkpHWThPQVlQT1JBWFhWQllKVC4u"
                      }
                    >
                      <Typography sx={{ py: 2 }}>フォームに答える</Typography>
                    </Button>
                    <Button
                      sx={{ width: "100%", textTransform: "none" }}
                      variant={"contained"}
                      color={"primary"}
                      href={"https://github.com/Sports-day"}
                      target={"_blank"}
                    >
                      <Stack direction={"row"} spacing={1} alignItems={"center"}>
                        <SvgIcon>
                          <FaGithubAlt />
                        </SvgIcon>
                        <Typography sx={{ py: 2 }}>
                          SPORTSDAYのGitHubを見る
                        </Typography>
                      </Stack>
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Container>
        </Box>
      </motion.div>
    </>
  );
}
