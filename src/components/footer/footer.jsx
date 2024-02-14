import { Flex, HStack, VStack, Text, Image, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import logo from "../../assets/PUPlogo.png";
import gmail from "../../assets/gmail.png";

export default function Footer() {
  return (
    <Flex
      position="absolute"
      bottom={0}
      w="100vw"
      bg="#740202" // Set the background color to gray
      minH="40px"
      justifyContent="center"
      alignItems="center"
      boxShadow="0px -2px 4px rgba(0, 0, 0, 0.2)" // Add a shadow
      color="white"
    >
      <VStack pb="0.5rem">
        <HStack flexWrap="wrap" justifyContent="center">
          <VStack spacing={1}>
            <HStack mt="0.5rem">
              <Image w="45px" src={logo} />
              <Text fontSize="0.7rem" fontFamily="inter">
                PUP Student Curriculum Evaluation System
              </Text>
            </HStack>
            <Box
              fontSize="0.7rem"
              justifyContent="left"
              pb={{ base: "0rem", md: "1rem", lg: "1rem" }}
              mr={{ base: "0", md: "auto", lg: "auto" }}
              pl={{ base: "auto", md: "3rem", lg: "3.3rem" }}
            >
              {" "}
              <Image w="16px" src={gmail} />
            </Box>
          </VStack>
          <Box ml={{ base: "0vw", md: "30vw", lg: "30vw" }} w="10rem">
            <VStack
              spacing={1}
              textAlign={{ base: "center", md: "left", lg: "left" }}
            >
              <Link to="/terms">
                <Text
                  fontSize="0.6rem"
                  fontFamily="inter"
                  textAlign={{ base: "center", md: "left", lg: "left" }}
                  w="10rem"
                >
                  About Us
                </Text>
              </Link>
              <Text
                fontSize="0.6rem"
                fontFamily="inter"
                textAlign={{ base: "center", md: "left", lg: "left" }}
                w="10rem"
              >
                Privacy Policy
              </Text>
              <Text
                fontSize="0.6rem"
                fontFamily="inter"
                textAlign={{ base: "center", md: "left", lg: "left" }}
                w="10rem"
              >
                Terms and Condition
              </Text>
            </VStack>
          </Box>
        </HStack>

        <HStack mr="auto" ml={{ base: "auto", md: "3rem", lg: "3rem" }}>
          <Text
            fontSize="0.5rem"
            fontFamily="inter"
            textAlign={{ base: "center", md: "left", lg: "left" }}
            // w="54vw"
            w="10rem"
          >
            Copyright 2024 PUPSCES || All rights reserved
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
}
