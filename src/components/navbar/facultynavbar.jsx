import {
  Box,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Text,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import InitialsAvatar from "react-initials-avatar";
import "react-initials-avatar/lib/ReactInitialsAvatar.css";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { HiMenu } from "react-icons/hi"; // Import the hamburger menu icon
import "../../components/navbar/navbar.css";
import { handleScroll } from "./handleNavbar";
import logo from "../../assets/PUPlogo.png";
import Cookies from "js-cookie";
import axios from "axios";
import { endPoint } from "../../pages/config";

function FacultyNavbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
          );
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

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

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Box
      w="100%"
      pos="fixed"
      h="6rem"
      boxShadow="none"
      top="0"
      right="0"
      className={navbarClasses}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        h="100%"
        gap={10}
        paddingX={20}
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

        {/* Drawer Component */}
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
                <InitialsAvatar name={facultyName} className="avatar-circle" />
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

        {/* Regular Navigation Links */}
        <Flex gap={34} mr="auto" display={{ base: "none", md: "flex" }}>
          <NavLink
            to="/facultyHome"
            activeClassName="active"
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/facultydashboard"
            activeClassName="active"
            className="nav-link"
          >
            Curriculum
          </NavLink>
          <NavLink
            to="/facultyevaluation"
            activeClassName="active"
            className="nav-link"
          >
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
          to="/facultyuserProfile"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
          display={{ base: "none", md: "block" }}
        >
          <InitialsAvatar name={facultyName} className="avatar-circle" />
        </ChakraLink>
      </Flex>
    </Box>
  );
}

export default FacultyNavbar;
