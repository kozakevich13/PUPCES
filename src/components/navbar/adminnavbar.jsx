import {
  Box,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import PUP from "../../assets/PUPlogo.png";

import { useEffect, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { Link as RouterLink } from "react-router-dom";
import "../../components/navbar/navbar.css";
import { handleScroll } from "./handleNavbar";

function AdminNavbar() {
  const [showNavbar, setShowNavbar] = useState(true);

  const scrollCallback = () => {
    if (window.scrollY > 100) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  };

  useEffect(() => {
    const cleanupScrollHandler = handleScroll(scrollCallback);

    return () => {
      cleanupScrollHandler();
    };
  }, []);

  const navbarClasses = `navbar ${showNavbar ? "" : "fade-out"}`;

  // const activeLinkStyle = {
  //   borderBottom: "2px solid #000", // You can adjust the style here
  //   paddingBottom: "3px", // Optional: Add some spacing between the text and the line
  // };

  return (
    <Box
      w="100%"
      pos="fixed"
      h="6rem"
      boxShadow="none"
      top="0"
      right="0"
      //  bgColor="#F3F8FF"
      className={navbarClasses}
    >
      <Flex padding="0 14.2rem" justifyContent="space-between" h="100%">
        <HStack padding="0 10rem 0">
          <Image src={PUP} alt="PUP Logo" boxSize="60px" objectFit="contain" />
          <Text fontWeight="semibold">PUP Curriculum Evaluaton System</Text>
        </HStack>

        <ChakraLink
          as={RouterLink}
          to="/userProfile"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <InitialsAvatar name="admin" className="avatar-circle" />
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default AdminNavbar;
