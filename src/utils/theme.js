// theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    palette: {
      primary: "#740202",
      secondary: "#FFFF",
    },
  },
  fonts: {
    body: `'Bitter Variable', sans-serif`,
  },
});

export default theme;
