import type { ReactNode } from "react";
import { CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@/components/ApolloProvider";
import { theme } from "@/app/theme";

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider>
        <CssBaseline />
        <GlobalStyles
          styles={{
            a: {
              textDecoration: "none",
              color: "inherit",
            },
          }}
        />
        {children}
      </ApolloProvider>
    </ThemeProvider>
  );
}
