import { Flex, useBreakpointValue, useTheme } from "@chakra-ui/react";

function Square() {
  const theme = useTheme();
  const primaryColor = theme.colors.palette.primary;

  const width = useBreakpointValue({  base: "100vw", lg: "50vw" });
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <Flex>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: width,
          height: "100vh",
          backgroundColor: primaryColor,
          opacity: isDesktop ? undefined : 0.9,
          transition: "all 0.2s ease",
        }}
      />
    </Flex>
  );
}

export default Square;
