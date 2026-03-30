import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    card: {
      main: "#5B6DC6",
      light: "#EFF0F8",
    },
    background: {
      default: "linear-gradient(135deg,  #5D6EC6 0%, #3F4DB3 90%)",
    },
    button: {
      main: "#5B6DC6",
      light: "#7F8CD6",
      veryLight: "#ffffff",
    },
  },
  typography: {
    firstFont: {
      fontSize: "30px",
      fontWeight: "medium",
      color: "#2F3C8C",
    },
    secondFont: {
      fontSize: "16px",
      fontWeight: "medium",
      color: "#EFF0F8",
    },

    buttonFont1: {
      fontSize: "14px",
      fontWeight: "medium",
      color: "#EFF0F8",
    },
    buttonFont2: {
      fontSize: "14px",
      fontWeight: "medium",
      color: "#5B6DC6",
    },
    buttonFont3: {
      fontSize: "14px",
      fontWeight: "medium",
      color: "#2F3C8C",
    },
  },
});
