import { Box, HStack, Image, Text, VStack } from "@chakra-ui/react";
import logo from "../../../assets/PUPlogo.png";

function Terms() {
  return (
    <Box w="100%" h="100vh" display="flex" justifyContent="center">
      <VStack mt="5rem" spacing="4">
        <HStack>
          <Image w="60px" src={logo} alt="PUP Logo" />
          <Text mr="50rem" fontWeight="bold">
            PUPSCES
          </Text>
        </HStack>
        <Text mr="50rem" fontWeight="bold" mt="4rem">
          TERMS OF USE
        </Text>
        <VStack
          mt="2rem"
          w="100%"
          spacing="3"
          align="start"
          justifyContent="center"
        >
          <Text ml="25rem">
            Thank you for using the PUPCES online services. Developed by CyBria
            Tech, in PUP Lopez Branch.
          </Text>
          <Text ml="25rem">
            By using our online services, you are agreeing to these terms.
            Please read carefully.
          </Text>
        </VStack>
        <Text mr="45rem" fontWeight="bold" mt="2rem">
          ACCEPTANCE OF TERMS
        </Text>
        <VStack
          mt="2rem"
          w="100%"
          spacing="3"
          align="start"
          justifyContent="center"
        >
          <Text ml="25rem" mr="22rem">
            The online services that PUPCES provides to you are the subject to
            the following Terms of Use. This is an agreement between you and the
            developers. By browsing and utilizing our online services, you agree
            to be governed by these Terms.
          </Text>
          <Text  mt="5rem"ml="25rem">
            The online services you are accessing provides various used for both
            students and university faculty employees.
          </Text>
        </VStack>
         <Text mt="5rem" fontFamily="bitter" fontWeight="semibold">
          COPY RIGHTS INFRINGEMENT
        </Text>
      </VStack>
    </Box>
  );
}

export default Terms;
