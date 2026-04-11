import { createTheme } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { createElement } from 'react'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5F6DC2',
      dark: '#2F3C8C',
      light: '#4A5ABB',
    },
    error: {
      main: '#D71212',
    },
    text: {
      primary: '#2F3C8C',
    },
    background: {
      default: '#EFF0F8',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", sans-serif',
    h1: { fontSize: '20px', fontWeight: 400 },
    body1: { fontSize: '16px', fontWeight: 400 },
  },
  shape: {
    borderRadius: 10,
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          boxShadow: '0px 1px 8px 0px rgba(0, 0, 0, 0.25)',
        },
        outlined: {
          backgroundColor: '#EFF0F8',
          borderColor: '#7F8CD6',
          color: '#2F3C8C',
          boxShadow: 'none',
        },
        text: {
          boxShadow: 'none',
        },
        contained: {
          backgroundColor: '#5F6DC2',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#4A5ABB',
          },
        },
      },
    },
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          color: '#2F3C8C',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          borderRadius: 10,
          padding: 8,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        slotProps: { inputLabel: { shrink: true } },
      },
    },
    MuiSelect: {
      defaultProps: {
        IconComponent: (props: React.ComponentProps<'svg'>) =>
          createElement(KeyboardArrowDownIcon, { ...props, style: { ...props.style, fontSize: 20, color: '#5B6DC6' } }),
      },
    },
    MuiNativeSelect: {
      defaultProps: {
        IconComponent: (props: React.ComponentProps<'svg'>) =>
          createElement(KeyboardArrowDownIcon, { ...props, style: { ...props.style, fontSize: 20, color: '#5B6DC6' } }),
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#D9DCED',
          borderRight: 'none',
        },
      },
    },
  },
})

export default theme
