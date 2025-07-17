import type { Metadata } from "next";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ApolloProvider } from "@/components/ApolloProvider";
import { Noto_Sans_JP } from "next/font/google";
import theme from "./theme";

const noto = Noto_Sans_JP({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  title: "SPORTSDAY FORM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={noto.className}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <ApolloProvider>
              <CssBaseline />
              {children}
            </ApolloProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
