import { ChakraProvider } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import theme from "./utils/theme.js";

import "@fontsource-variable/bitter";
import { UserContextProvider } from "./pages/routes/UserContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </UserContextProvider>
  </React.StrictMode>
);
