import {
  Box,
  Button,
  HStack,
  Image,
  VStack,
  Text,
  Wrap,
  Link as ChakraLink,
} from "@chakra-ui/react";
import PUP from "../../assets/PUPlogo.png";
import Footer from "../../components/footer/footer";
import "./admin.css";
import Dashboard from "./component/Dashboard";
import Gender from "./component/GenderCard";
import StudentFaculty from "./component/StudentsPerProgramStatus";
import FacultyUpload from "./pages/FacultyUpload";
import ProgramUpload from "./pages/ProgramUpload";
import InitialsAvatar from "react-initials-avatar";
import { Link as RouterLink } from "react-router-dom";

export default function Admin() {
  const scrollToFacultyUpload = () => {
    const facultyUploadSection = document.getElementById(
      "facultyUploadSection"
    );
    if (facultyUploadSection) {
      facultyUploadSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box
      mt="0"
      mb="0"
      flexGrow={1}
      w="100vw"
      h="100vh"
      bgColor="#F8F8F8"
      display="flex"
      flexDirection="column"
      padding=" 2rem 0 0 0"
      overflowY="auto"
    >
      <HStack justifyContent="space-between">
        <HStack
          pl={{ base: "1rem", md: "5rem", lg: "10rem" }}
          pr={{ base: "1rem", md: "5rem", lg: "10rem" }}
        >
          <Image src={PUP} alt="PUP Logo" boxSize="60px" objectFit="contain" />
          <Text fontWeight="semibold">PUP Curriculum Evaluaton System</Text>
        </HStack>
        <ChakraLink
          as={RouterLink}
          to="/adminuser"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <Box
            style={{
              width: "40px", // Set to your preferred size
              height: "40px", // Set to your preferred size
              borderRadius: "50%",
              backgroundColor: "#740202",
              color: "#E5F4E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
            mr={{ base: "1rem", md: "5rem", lg: "10rem" }}
          >
            <InitialsAvatar name="Admin" />
          </Box>
        </ChakraLink>
      </HStack>

      <HStack
        pl={{ base: "1rem", md: "5rem", lg: "10rem" }}
        pr={{ base: "1rem", md: "5rem", lg: "10rem" }}
        justifyContent="space-between"
        mt="4rem"
      >
        <Text fontSize="22px" fontWeight="semibold">
          Dashboard
        </Text>
        <Button ml="1rem" onClick={scrollToFacultyUpload}>
          Upload
        </Button>
      </HStack>

      <Wrap mt="2rem" ml={{ base: "1rem", md: "2rem", lg: "5rem" }}>
        <VStack>
          <Dashboard />
        </VStack>
      </Wrap>

      <Box
        ml={{ base: "auto", md: "4rem", lg: "auto" }}
        mr={{ base: "auto", md: "0rem", lg: "auto" }}
        mt="3rem"
      >
        <Gender />
      </Box>
      <Box
        ml={{ base: "auto", md: "4rem", lg: "auto" }}
        mr={{ base: "auto", md: "0rem", lg: "auto" }}
        mt="3rem"
      >
        <StudentFaculty />
      </Box>
      <Box
        ml={{ base: "auto", md: "4rem", lg: "auto" }}
        mr={{ base: "auto", md: "0rem", lg: "auto" }}
        mt="3rem"
        id="facultyUploadSection"
      >
        <FacultyUpload />
      </Box>
      <Box
        ml={{ base: "auto", md: "4rem", lg: "auto" }}
        mr={{ base: "auto", md: "0rem", lg: "auto" }}
        mt="3rem"
        id="facultyUploadSection"
      >
        <ProgramUpload />
      </Box>
      <Box mt="12rem" position="relative" bg="red">
        <Footer />
      </Box>
    </Box>
  );
}
