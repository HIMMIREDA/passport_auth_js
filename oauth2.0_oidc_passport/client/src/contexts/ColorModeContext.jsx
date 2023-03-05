import { ThemeProvider, useTheme } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";
import React, { createContext, useMemo, useState } from "react";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ColorModeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("mode") || "light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const value = prev === "light" ? "dark" : "light";
          localStorage.setItem("mode", value);
          return value;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default ColorModeContext;
