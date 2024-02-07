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
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { endPoint } from "../../config";
import { useUser } from "../../routes/UserContext";
import ForgotPassword from "../components/forgot-password/studentForgotPassword";
import StudentSignIn from "./studentSignin";

export default function NewStudentSignin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [student_number, setStudnum] = useState("");
  const [programAbbr, setProgramAbbr] = useState("");
  const [programId, setProgramId] = useState("");
  const [strand, setStrand] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();

  const navigate = useNavigate();

  const handleStudentNumberChange = (e) => {
    const value = e.target.value;
    console.log("Input value:", value);
    setStudnum(value);
  };

  const handleStrandChange = (e) => {
    const value = e.target.value;
    console.log("Strand value:", value);
    setStrand(value);
  };

  const handleProgramChange = (e) => {
    const value = e.target.value;
    console.log("Program value:", value);
    setProgramAbbr(value);
  };

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

  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };
  //const toast = useToast();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setError("");
    }, 2000);

    return () => clearTimeout(timeout);
  }, [error]);

  // handleSignin
  const handleSignIn = async () => {
    console.log("handleSignIn function is called");
    console.log("Student number:", student_number);

    // Check if all required fields are filled
    if (
      !email ||
      !password ||
      !student_number ||
      !programAbbr ||
      !strand ||
      !status ||
      !gender
    ) {
      setError("Please fill in all the fields");
      return;
    }

    console.log("Logging in with student number:", student_number);

    try {
      // Step 1: Fetch student data
      const studentResponse = await fetch(
        `${endPoint}/students?studentNumber=${student_number}`
      );
      const students = await studentResponse.json();

      // Check if the student data fetching was successful
      if (!studentResponse.ok) {
        console.error("Failed to fetch student data");
        throw new Error("Failed to fetch student data");
      }

      console.log("Students data:", students);

      // Ensure the student object has the expected structure
      if (!students || !students.email || !students.student_password) {
        console.error("Invalid student data structure:", students);
        throw new Error("Invalid student data structure");
      }

      // Step 2: Calculate the school year
      const studentYear = parseInt(student_number.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      const schoolYear = currentYear - studentYear + 1;

      // Step 3: Fetch program data
      const programResponse = await fetch(`${endPoint}/programs`);

      // Check if the program data fetching was successful
      if (!programResponse.ok) {
        console.error("Failed to fetch program data");
        throw new Error("Failed to fetch program data");
      }

      const programData = await programResponse.json();
      console.log("Program data:", programData);

      // Ensure the program object has the expected structure
      if (
        !programData ||
        programData.length === 0 ||
        !programData[0].program_id
      ) {
        console.error("Invalid program data structure:", programData);
        throw new Error("Invalid program data structure");
      }

      // Step 4: Store student data with program_id
      const response = await fetch(`${endPoint}/students/${student_number}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender,
          status,
          school_year: schoolYear,
          program_id: programId,
          strand,
        }),
      });

      // Check if the student data storing was successful
      if (!response.ok) {
        console.error("Failed to store student data");
        throw new Error("Failed to store student data");
      }

      console.log("students.student_number:", students.student_number);
      console.log("student_number:", student_number);

      // Check if the student's credentials match
      console.log("Before if condition");
      if (
        students.student_number === student_number &&
        students.email === email &&
        students.student_password === password
      ) {
        console.log("Inside if condition");

        // Set user context and cookie
        setUser({
          username: students.username,
          roles: students.roles,
          student_number: students.student_number,
        });
        Cookies.set("student_number", students.student_number, { expires: 10 });
        Cookies.set("program_id", programId, { expires: 10 });
        Cookies.set("strand", strand, { expires: 10 });

        console.log(
          "Student number logged in and cookie:",
          students.student_number
        );
        console.log("Program logged in and cookie:", programData[0].program_id);
        console.log("Strand logged in and cookie:", students.strand);

        // Navigate to studentdashboard
        console.log("Before navigation");
        navigate("/studentdashboard");
        console.log("After navigation");
      } else {
        setError("Invalid credentials");
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
    <Flex position="relative" justifyContent="center" alignItems="center">
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
            {/* STUDENT NUMBER */}
            <Input
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Student Number"
              color="palette.primary"
              // w="21rem"
              value={student_number}
              onChange={handleStudentNumberChange}
            />
            {/*  Email */}
            <Input
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Email"
              color="palette.primary"
              // w="21rem"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {/* PROGRAM */}
            <Select
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Program"
              color="gray"
              // w="21rem"
              opacity="1"
              cursor={"pointer"}
              value={programAbbr}
              onChange={handleProgramChange}
            >
              <option value="BSIT">BSIT</option>
              <option value="DIT">DIT</option>
              <option value="BSOA">BSOA</option>
              <option value="BSCE">BSCE</option>
              <option value="BSEE">BSEE</option>
              <option value="DCVET">DCVET</option>
              <option value="DEET">DEET</option>
              <option value="DOMT">DOMT</option>
              <option></option>
            </Select>

            {/* STRAND */}
            <Select
              height="2rem"
              bg="palette.secondary"
              variant="outline"
              placeholder="Senior High Strand"
              color="gray"
              // w="21rem"
              opacity="1"
              cursor={"pointer"}
              value={strand}
              onChange={handleStrandChange}
            >
              <option value="STEM">
                STEM (Science, Technology, Engineering, and Mathematics)
              </option>
              <option value="ABM">
                ABM (Accountancy, Business, and Management)
              </option>
              <option value="HUMSS">
                HUMSS (Humanities and Social Sciences)
              </option>
              <option value="GAS">GAS (General Academic Strand)</option>
              <option value="Home Economics">Home Economics</option>
              <option value="ICT">
                Information and Communications Technology (ICT)
              </option>
              <option value="AFA">Agri-Fishery Arts</option>
              <option value="Sports">Sports</option>
            </Select>
            <HStack width="100%">
              {/* STATUS */}
              <Select
                height="2rem"
                bg="palette.secondary"
                variant="outline"
                color="gray"
                opacity="1"
                cursor={"pointer"}
                placeholder="Status"
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="Regular">Regular</option>
                <option value="Back Subject">Back Subject</option>
                <option value="Transferee">Transferee</option>
                <option value="Shiftee">Shiftee</option>
                <option value="Returnee">Returnee</option>
                <option value="Ladderized">Ladderized</option>
              </Select>

              {/* GENDER */}
              <Select
                height="2rem"
                bg="palette.secondary"
                variant="outline"
                color="gray"
                opacity="1"
                cursor={"pointer"}
                placeholder="Gender"
                value={gender}
                onChange={(event) => setGender(event.target.value)}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </Select>
            </HStack>

            {/* PASSWORD */}
            <InputGroup size="md">
              <Input
                height="2rem"
                bg="palette.secondary"
                pr="4.5rem"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                color="palette.primary"
                // w="21rem"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <InputRightElement mr="auto">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
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
              cursor={"pointer"}
            >
              Forgot Password?
            </Text>

            <Button
              onClick={() => handleSignIn()}
              size="md"
              height="2rem"
              width="100%"
              border="2px"
              bg="#FAECD6"
              borderColor="#FFF5E0"
            >
              Log In
            </Button>

            <HStack
              mt="2rem"
              flexWrap="wrap"
              justifyContent="center"
              marginX="auto"
            >
              <Text fontSize="xs" color="gray">
                By clicking Log In you agree to our
              </Text>
              <Link to="/terms">
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Terms
                </Text>
              </Link>
              <Text fontSize="xs" color="gray">
                and
              </Text>
              <Link to="/policy">
                <Text fontSize="xs" fontWeight="bold" color="gray.500">
                  Privacy Policy
                </Text>
              </Link>
            </HStack>
            <HStack
              mt="1rem"
              flexWrap="wrap"
              justifyContent="center"
              marginX="auto"
            >
              <Text fontSize="xs" color="gray">
                Not a new user?
              </Text>
              <Text
                fontSize="xs"
                color="gray.400"
                cursor="pointer"
                onClick={handleSignInClick}
              >
                {" "}
                Click here to login
              </Text>
            </HStack>

            <Text
              mt="1rem"
              fontSize="xs"
              color="gray"
              marginX="auto"
              textAlign="center"
            >
              Copyright 2023 Visionalyze || All rights reserved.
            </Text>
          </VStack>
        </Box>
      )}

      {showSignIn && <StudentSignIn onCancel={() => setShowSignIn(false)} />}
    </Flex>
  );
}
