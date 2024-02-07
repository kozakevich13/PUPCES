import { Flex, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <Flex
      position="absolute"
      bottom={0}
      w="100%"
      bg="gray.100" // Set the background color to gray
      minH="40px"
      justifyContent="center"
      alignItems="center"
      boxShadow="0px -2px 4px rgba(0, 0, 0, 0.2)" // Add a shadow
    >
      <HStack flexWrap="wrap" justifyContent="center">
        <Text color="black" fontSize="0.8rem" fontFamily="inter">
          For questions and comments, email us at @pupscesgmail.com
        </Text>

        <HStack>
          <Link to="/terms">
            <Text color="black" fontSize="0.8rem" fontFamily="inter">
              Terms
            </Text>
          </Link>
          <Text color="black" fontSize="0.8rem" fontFamily="inter">
            and
          </Text>
          <Text color="black" fontSize="0.8rem" fontFamily="inter">
            Privacy Policy
          </Text>
        </HStack>
      </HStack>
    </Flex>
  );
}
