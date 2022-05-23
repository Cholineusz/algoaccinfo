import * as React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000000",
    },
    success: {
      main: "#006B38",
    },
    error: {
      main: "#E94B3C",
    },
    warning: {
      main: "#D68E00"
    }
  },
  typography: {
    balance: {
      fontSize: 25,
      fontWeight: 600,
      color: "#000000",
    },
    available: {
      fontSize: 20,
      fontWeight: 600,
      color: "#006B38",
    },
    reserved: {
      fontSize: 20,
      fontWeight: 600,
      color: "#E94B3C",
    },
    governance: {
      fontSize: 25,
      fontWeight: 600,
      color: "#FF9A1B"
    },
    warning: {
      fontSize: 16,
      fontWeight: 600,
      color: "#D68E00"
    },
    version: {
      fontSize: 16,
      fontWeight: 600,
      color: "black"
    }
  },
});

export default function Theme({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
