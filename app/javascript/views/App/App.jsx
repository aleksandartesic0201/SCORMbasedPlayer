import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard";
import Login from "../Login";
import Upload from "../Upload";
import Register from "../Register";
import NoMatch from "../NoMatch";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.scss";

const theme = createTheme({
  palette: {
    primary: {
      light: "#ffa496",
      main: "#f37368",
      dark: "#bc433d",
      contrastText: "#ffffff",
    },
    secondary: {
      light: "#608591",
      main: "#335863",
      dark: "#042f39",
      contrastText: "#ffffff",
    },
  },
});

const App = () => {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Routes>
          
          <Route path="/" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/register" element={<Register />} />
          <Route path="/list" element={<Dashboard />} />{" "}
          {/* TODO: Enforce user to be logged in to see this route -- is there a way to do a catchall validation for some components? */}
          <Route path="*" element={<NoMatch />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
};

export default App;
