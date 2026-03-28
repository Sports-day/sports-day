import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    card: {
      main: "#5B6DC6",
      light: "#F4F5F9",
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
      color: "#000000",
    },
    secondFont: {
      fontSize: "16px",
      fontWeight: "medium",
      color: "#E1E4F6",
    },

    buttonFont1: {
      fontSize: "14px",
      fontWeight: "medium",
      color: "#E1E4F6",
    },
    buttonFont2: {
      fontSize: "14px",
      fontWeight: "medium",
      color: "#5B6DC6",
    },
  },
});
