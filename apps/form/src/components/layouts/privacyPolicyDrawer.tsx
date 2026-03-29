"use client";
import { Container, Button, AppBar, Box, Drawer } from "@mui/material";
import React from "react";
import PrivacyPolicy from "@/components/layouts/PrivacyPolicy";
import { useTheme } from "@mui/material/styles";

export type PrivacyPolicyDrawerProps = {
  children?: string;
  transparent?: boolean;
};

export default function PrivacyPolicyDrawer(props: PrivacyPolicyDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <>
      <AppBar
        sx={{
          position: "fixed",
          zIndex: "999",
          background: theme.palette.background.default,
        }}
      >
        <Box
          sx={{
            width: "100vw",
            height: "auto",
            overflow: "scrollable",
          }}
        >
          <Container maxWidth={"xl"}>
            <Button
              sx={{ width: "100%" }}
              color="inherit"
              onClick={toggleDrawer(false)}
              aria-label="close"
            >
              <Box component="span" sx={{ mr: 1, lineHeight: 1 }}>
                ×
              </Box>
              閉じる
            </Button>
          </Container>
        </Box>
      </AppBar>
      <Box
        sx={{
          width: "100vw",
          height: "auto",
          overflow: "scrollable",
          mt: "50px",
          background: theme.palette.card.light,
        }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <PrivacyPolicy />
      </Box>
    </>
  );

  return (
    <>
      <Button
        color={"secondary"}
        sx={{
          width: "100%",
          background: props.transparent
            ? "transparent"
            : theme.palette.button.main,
          borderRadius: "10px",
          "&:hover": {
            background: props.transparent
              ? "transparent"
              : theme.palette.button.main,
            opacity: 0.9,
          },
        }}
        variant="contained"
        disableElevation
        onClick={toggleDrawer(true)}
      >
        {props.children}
      </Button>
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        anchor={"bottom"}
      >
        {DrawerList}
      </Drawer>
    </>
  );
}
