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
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { endPoint } from "../../config";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgotpassword/facultyForgotPassword";
import FacultySignIn from "./facultySignin";

export default function NewFaculty() {
  const [showPassword, setShowPassword] = useState(false);
  const [birthdate, setBirthdate] = useState(null);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [programAbbr, setProgramAbbr] = useState("");
  const [programId, setProgramId] = useState("");
  const [facultyId, setFacultyId] = useState("");
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

  // Function to format birthdate to "yyyy-MM-dd" format

  function formatBirthdate(rawBirthdate) {
    const date = new Date(rawBirthdate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        console.log("All Programs:", programs);

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (program) => program.program_abbr === programAbbr
        );

        console.log("Selected Program:", selectedProgram);

        if (selectedProgram) {
          const programId = selectedProgram.program_id;
          console.log("Program ID:", programId);
          setProgramId(programId);
          console.log("Program ID has been set:", programId);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [programAbbr]);

  //const toast = useToast();
  const handleSignIn = async () => {
    if (
      !email ||
      !password ||
      !birthdate ||
      !programAbbr ||
      !gender ||
      !facultyId
    ) {
      setError("Please fill in all the fields.");
      return;
    }
    console.log("Logging in with faculty number:", facultyId);

    try {
      // Fetch faculty data
      const facultyResponse = await fetch(`${endPoint}/faculty/${email}`);

      if (!facultyResponse.ok) {
        console.error("Failed to fetch faculty data");
        throw new Error("Failed to fetch the faculty data");
      }

      const facultyData = await facultyResponse.json();
      console.log("Faculty Data from API:", facultyData);

      if (!facultyData || Object.keys(facultyData).length === 0) {
        console.error("Invalid faculty data structure:", facultyData);
        throw new Error("Invalid faculty data structure");
      }

      // Ensure the faculty object has the expected structure
      if (
        !facultyData ||
        !facultyData.email ||
        !facultyData.faculty_password ||
        !facultyData.faculty_id
      ) {
        console.error("Invalid faculty data structure:", facultyData);
        throw new Error("Invalid faculty data structure");
      }

      // Fetch program data
      const programResponse = await fetch(`${endPoint}/programs`);

      if (!programResponse.ok) {
        console.error("Failed to fetch program data");
        throw new Error("Failed to fetch the program data");
      }
      const programData = await programResponse.json();
      console.log("Program Data from API:", programData);
      if (
        !programData ||
        programData.length === 0 ||
        !programData[0].program_id
      ) {
        console.error("Invalid program data structure:", programData);
        throw new Error("Invalid program data structure");
      }

      const formattedUserBirthdate = formatBirthdate(birthdate);
      console.log("Formatted User Birthdate:", formattedUserBirthdate);

      // Perform the update request to store the updated faculty data
      const updateResponse = await fetch(`${endPoint}/faculty/${facultyId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender,
          birthdate,
          program_id: programId,
        }),
      });
      console.log("Update Response:", updateResponse);

      if (!updateResponse.ok) {
        console.error("Failed to fetch faculty data");
        throw new Error("Failed to update faculty data");
      }
      // Check if the student's credentials match
      console.log("Before if condition");
      if (
        facultyData.faculty_id === facultyId &&
        facultyData.email === email &&
        facultyData.faculty_password === password
      ) {
        console.log("Inside if condition");

        setUser({
          username: facultyData.username,
          roles: facultyData.roles,
          faculty_id: facultyData.faculty_id,
        });
        Cookies.set("facultyEmail", facultyData.email, { expires: 7 });
        Cookies.set("Program", facultyData.program, { expires: 7 });
        console.log(facultyData.program);

        console.log(
          "Student number logged in and cookie:",
          facultyData.faculty_id
        );
        console.log("Program logged in and cookie:", facultyData.program);

        navigate("/facultydashboard");
      } else {
        setError("Selected program not found in the program table");
      }
      console.log("After if condition");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred");
    }
  };

  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignInClick = () => {
    setShowSignIn(true);
    setShowForgotPassword(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
    setShowSignIn(false);
  };

  return (
    <Flex
      position="relative"
      justifyContent="center"
      alignItems="center"
      // mx="1rem"
    >
      <AnimatePresence>
        {showForgotPassword ? (
          <ForgotPassword onCancel={() => setShowForgotPassword(false)} />
        ) : null}
      </AnimatePresence>

      {!showSignIn && !showForgotPassword && (
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
            {/* FACULTY ID */}
            <Input
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Faculty Number"
              color="palette.primay"
              // maxW="21rem"
              _placeholder={{
                color: "#5C596E",
                opacity: ".8",
              }}
              focusBorderColor="palette.secondary"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            />
            {/* EMAIL */}
            <Input
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Email"
              color="palette.primay"
              w="100%"
              // maxW="21rem"
              _placeholder={{
                color: "#5C596E",
                opacity: ".8",
              }}
              focusBorderColor="palette.secondary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <DatePicker
              customInput={
                <Input
                  height="2rem"
                  _placeholder={{
                    color: "#5C596E",
                    opacity: ".8",
                  }}
                  focusBorderColor="palette.secondary"
                  // maxW="22rem"
                  w="155%"
                  bg="palette.secondary"
                  style={{ borderRadius: "5px" }}
                />
              }
              selected={birthdate}
              onChange={(date) => setBirthdate(date)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              placeholderText="Birthdate"
              dateFormat="yyyy-MM-dd"
              maxDate={new Date()}
            />
            {/* Program */}
            <Select
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Program"
              color="gray"
              // maxW="21rem"
              opacity="1"
              cursor={"pointer"}
              value={programAbbr}
              onChange={(event) => setProgramAbbr(event.target.value)}
            >
              <option value="BSIT">BSIT</option>
              <option value="DIT">DIT</option>
              <option value="BSOA">BSOA</option>
              <option></option>
            </Select>
            <Select
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              color="gray"
              // maxW="21rem"
              opacity="1"
              cursor={"pointer"}
              placeholder="Gender"
              value={gender}
              onChange={(event) => setGender(event.target.value)}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </Select>

            {/* PASSWORD */}
            <InputGroup size="md">
              <Input
                height="2rem"
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
              <InputRightElement mr="auto">
                <Button
                  h="1.75rem"
                  width="100%"
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
              height="2rem"
              // maxW="21rem"
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
              <Text fontSize="xs" fontWeight="bold" color="gray">
                Terms
              </Text>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Text fontSize="xs" fontWeight="bold" color="gray">
                Privacy Policy
              </Text>
            </HStack>
          </VStack>
          <HStack mt="1rem" flexWrap="wrap" justifyContent="center">
            <Text fontSize="xs" color="gray">
              Not a new user?
            </Text>
            <Text
              fontSize="xs"
              color="gray"
              cursor="pointer"
              onClick={handleSignInClick}
            >
              {" "}
              Click here to login
            </Text>
          </HStack>
          <Text mt="1rem" fontSize="xs" color="gray" textAlign="center">
            Copyright 2023 Visionalyze || All rights reserved.
          </Text>
        </Box>
      )}
      {showSignIn && <FacultySignIn onCancel={() => setShowSignIn(false)} />}
    </Flex>
  );
}
