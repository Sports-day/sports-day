import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    card: Palette["primary"];
    button: Palette["primary"];
  }

  interface PaletteOptions {
    card?: PaletteOptions["primary"];
    button?: PaletteOptions["primary"];
  }

  interface PaletteColor {
    veryLight?: string;
  }

  interface SimplePaletteColorOptions {
    veryLight?: string;
  }

  interface TypographyVariants {
    firstFont: React.CSSProperties;
    secondFont: React.CSSProperties;
    buttonFont1: React.CSSProperties;
    buttonFont2: React.CSSProperties;
    buttonFont3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    firstFont?: React.CSSProperties;
    secondFont?: React.CSSProperties;
    buttonFont1?: React.CSSProperties;
    buttonFont2?: React.CSSProperties;
    buttonFont3?: React.CSSProperties;
  }
}
