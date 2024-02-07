import {
  Box,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { NavLink, Link as RouterLink } from "react-router-dom";
import logo from "../../assets/PUPlogo.png";
import "../../components/navbar/navbar.css";
import { endPoint } from "../../pages/config";

function Navbar() {
  const studentNumber = Cookies.get("student_number");

  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        // Assuming the API returns an object with "first_name" and "last_name" properties
        const fullName = `${response.data.first_name} ${response.data.last_name}`;
        setStudentName(fullName.trim());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);
  console.log("Student Name in Navbar", studentName);
  // const scrollCallback = () => {
  //   if (window.scrollY > 100) {
  //     setShowNavbar(false);
  //   } else {
  //     setShowNavbar(true);
  //   }
  // };

  // useEffect(() => {
  //   const cleanupScrollHandler = handleScroll(scrollCallback);

  //   return () => {
  //     cleanupScrollHandler();
  //   };
  // }, []);

  // const navbarClasses = `navbar ${showNavbar ? "" : "fade-out"}`;

  // const activeLinkStyle = {
  //   borderBottom: "2px solid #000", // You can adjust the style here
  //   paddingBottom: "3px", // Optional: Add some spacing between the text and the line
  // };

  return (
    <Box
      w="100%"
      pos="sticky"
      h="6rem"
      boxShadow="lg"
      top="0"
      right="0"
      bgColor="#F3F8FF"
      zIndez="1"
    >
      <Flex
        padding="0 14.2rem"
        justifyContent="space-between"
        alignItems="center"
        h="100%"
      >
        <HStack>
          <Image w="45px" src={logo} />
          <Text
            fontSize="18px"
            fontWeight="medium"
            display="flex"
            justifyContent="center"
          >
            PUPCES
          </Text>
        </HStack>
        <Flex gap={34} mr="30rem">
          <NavLink
            to="/studentdashboard"
            activeclassname="active"
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/curriculum"
            activeclassname="active"
            className="nav-link"
          >
            Curriculum
          </NavLink>
          <NavLink
            to="/analysis"
            activeclassname="active"
            className="nav-link" // You can define a CSS class for styling other links
          >
            Evaluation
          </NavLink>
        </Flex>

        <ChakraLink
          as={RouterLink}
          to="/userProfile"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <InitialsAvatar name={studentName} className="avatar-circle" />
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default Navbar;
