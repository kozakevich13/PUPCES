import {
  Box,
  Flex,
  HStack,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { handleScroll } from "./handleNavbar";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { NavLink, Link as RouterLink } from "react-router-dom";
import logo from "../../assets/PUPlogo.png";
import "../../components/navbar/navbar.css";
import { endPoint } from "../../pages/config";
import { HiMenu } from "react-icons/hi";

function Navbar() {
  const studentNumber = Cookies.get("student_number");

  const [studentName, setStudentName] = useState("");
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // const activeLinkStyle = {
  //   borderBottom: "2px solid #000", // You can adjust the style here
  //   paddingBottom: "3px", // Optional: Add some spacing between the text and the line
  // };
  const navbarClasses = `navbar ${showNavbar ? "" : "fade-out"}`;

  return (
    <Box
      w="100%"
      pos="fixed"
      h="6rem"
      boxShadow="none"
      top="0"
      right="0"
      bgColor="#F3F8FF"
      zIndex="1"
      // className={navbarClasses}
    >
      <Flex
        px={{ base: "6", md: "6.2rem", lg: "8rem", xl: "10rem" }}
        justifyContent="space-between"
        alignItems="center"
        h="100%"
      >
        <HStack spacing="2">
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

        <Drawer
          isOpen={isDrawerOpen}
          onClose={handleDrawerClose}
          placement="right"
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader display="flex" justifyContent="space-between">
              <ChakraLink
                as={RouterLink}
                to="/facultyuserProfile"
                _hover={{ textDecoration: "none", color: "black" }}
                _focus={{ outline: "none" }}
              >
                <InitialsAvatar name={studentName} className="avatar-circle" />
              </ChakraLink>
              <DrawerCloseButton />
            </DrawerHeader>
            <DrawerBody>
              {/* Navigation Links */}
              <Flex flexDirection="column">
                <NavLink
                  to="/facultyHome"
                  activeClassName="active"
                  className="nav-link drawer"
                  onClick={handleDrawerClose}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/facultydashboard"
                  activeClassName="active"
                  className="nav-link drawer"
                  onClick={handleDrawerClose}
                >
                  Curriculum
                </NavLink>
                <NavLink
                  to="/facultyevaluation"
                  activeClassName="active"
                  className="nav-link drawer"
                  onClick={handleDrawerClose}
                >
                  Evaluation
                </NavLink>
              </Flex>
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Flex
          gap={34}
          mx="auto"
          ml="auto"
          display={{ base: "none", md: "flex" }}
        >
          <NavLink
            to="/studentdashboard"
            activeClassName="active"
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/curriculum"
            activeClassName="active"
            className="nav-link"
          >
            Curriculum
          </NavLink>
          <NavLink to="/analysis" activeClassName="active" className="nav-link">
            Evaluation
          </NavLink>
        </Flex>

        {/* Hamburger Menu Icon */}
        <IconButton
          aria-label="Open Menu"
          icon={<HiMenu fontSize={28} />}
          justifyContent="center"
          onClick={handleDrawerOpen}
          display={{ base: "flex", md: "none" }} // Show only on tablet and mobile
        />

        <ChakraLink
          as={RouterLink}
          to="/userProfile"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
          display={{ base: "none", md: "block" }}
        >
          <InitialsAvatar name={studentName} className="avatar-circle" />
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default Navbar;
