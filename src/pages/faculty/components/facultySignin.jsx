import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
} from "@chakra-ui/react";

import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { endPoint } from "../../config";

import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgotpassword/facultyForgotPassword";
import NewFaculty from "./NewFaculty";
export default function FacultySignIn() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { setUser } = useUser();
  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);
  // styling the eye for password
  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all the fields.");
        return;
      }

      console.log("Attempting login with the following data:");
      console.log("Email:", email);
      console.log("Password:", password);

      // Fetch faculty data
      const facultyResponse = await fetch(`${endPoint}/faculty/${email}`);
      const facultyData = await facultyResponse.json();

      console.log("Faculty data from server:", facultyData);

      if (
        "message" in facultyData &&
        facultyData.message === "Faculty not found"
      ) {
        console.log("Faculty not found. Proceeding with admin data.");

        // Fetch admin data
        const adminResponse = await fetch(
          `${endPoint}/admin/${encodeURIComponent(email)}`
        );
        const admin = await adminResponse.json();

        console.log("Admin data from server:", admin);

        if (admin.length > 0) {
          const adminData = admin[0]; // Access the first (and only) element of the array

          if (
            adminData.admin_email === email &&
            adminData.admin_password === password
          ) {
            setUser({
              username: adminData.username,
              roles: adminData.roles,
            });
            Cookies.set("adminEmail", adminData.admin_email, { expires: 7 });
            navigate("/admin");
          } else {
            console.log("Invalid input. Check credentials:");
            console.log("Expected Email:", adminData.admin_email);
            console.log("Actual Email:", email);
            console.log("Expected Password:", adminData.admin_password);
            console.log("Actual Password:", password);

            setError("Invalid input");
          }
        } else {
          setError("Invalid input");
        }
      } else {
        if (
          facultyData.email === email &&
          facultyData.faculty_password === password
        ) {
          setUser({
            username: facultyData.username,
            roles: facultyData.roles,
          });
          Cookies.set("facultyEmail", facultyData.email, { expires: 7 });
          navigate("/facultydashboard");
        } else {
          setError("Data is invalid");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
    }
  };

  const [showNewSignIn, setShowNewSignIn] = useState(false);

  const handleNewSignInClick = () => {
    setShowNewSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowNewSignIn(false);
  };

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      mx="1rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showNewSignIn && !showForgotPassword && (
        <Box mr="0">
          <VStack align="flex-start" justifyContent="center">
            <Text fontSize="2rem" color="white" mb="1rem">
              Sign In
            </Text>
            <AnimatePresence>
              {error ? (
                <Center
                  bg="#FAECD6"
                  w="65.5%"
                  p=".8rem"
                  borderRadius=".3rem"
                  as={motion.div}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
                  exit={{ opacity: 0, y: 0, transition: { duration: 0.2 } }}
                  color="palette.primary"
                  fontWeight="inter"
                  fontSize=".9rem"
                  fontFamily="inter"
                  textAlign="center"
                >
                  {error}
                </Center>
              ) : null}
            </AnimatePresence>
            <Divider mb="1rem" />

            {/* /EMAIL */}
            <Input
              bg="palette.secondary"
              variant="outline"
              placeholder="Email"
              color="palette.primay"
              // maxW="21rem"
              _placeholder={{
                color: "#5C596E",
                opacity: ".8",
              }}
              focusBorderColor="palette.secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* PASSWORD */}
            <InputGroup size="md">
              <Input
                bg="palette.secondary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                color="palette.primary"
                // maxW="21rem"
                _placeholder={{
                  color: "#5C596E",
                  opacity: ".8",
                }}
                focusBorderColor="palette.secondary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement>
                <Button
                  h="1.75rem"
                  size="sm"
                  _hover={{ background: "none", border: "none" }}
                  _focus={{ background: "none", border: "none" }}
                  _active={{ background: "none", border: "none" }}
                  style={buttonStyles}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEye color="palette.primary" />
                  ) : (
                    <FaEyeSlash color="palette.primary" />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>

            <Text
              ml="auto"
              fontSize="14px"
              color="gray"
              fontWeight="bold"
              align="flex-end"
              mt="1rem"
              mb="1rem"
              onClick={handleForgotPasswordClick}
              cursor="pointer"
            >
              Forgot Password?
            </Text>

            <Button
              size="md"
              height="40px"
              width="100%"
              border="2px"
              bg="#FAECD6"
              onClick={() => handleSignIn()}
            >
              Sign In
            </Button>

            <HStack mt="2rem" flexWrap="wrap" justifyContent="center">
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.400">
                Terms
              </Text>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray.400">
                Privacy Policy
              </Text>
            </HStack>

            <HStack mt="2rem" marginX="auto">
              <Text fontSize="xs" color="gray">
                Are you a new user?
              </Text>
              <Text
                fontSize="xs"
                color="#F0F0F0"
                cursor="pointer"
                onClick={handleNewSignInClick}
              >
                Click here to login
              </Text>
            </HStack>
          </VStack>
          <Text mt="3rem" fontSize="xs" color="gray" textAlign="center">
            Copyright 2023 Visionalyze || All rights reserved.
          </Text>
        </Box>
      )}
      {showNewSignIn && <NewFaculty onCancel={() => setShowNewSignIn(false)} />}
    </Flex>
  );
}
