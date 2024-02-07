import { Flex, useTheme } from "@chakra-ui/react";

function Triangle() {
  const theme = useTheme();
  const primaryColor = theme.colors.palette.primary;
  return (
    <Flex>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 60vw 400vh 0",
          borderColor: `transparent  ${primaryColor} `,
          clipPath: "polygon(0 0, 100% 0, 100% 100%)",
          transition: "all 0.2s ease",
        }}
      />
    </Flex>
  );
}
export default Triangle;
