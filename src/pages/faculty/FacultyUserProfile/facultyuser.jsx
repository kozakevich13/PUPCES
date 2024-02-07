import {
  Box,
  Button,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";
import { endPoint } from "../../config";
import FacultyModal from "./facultymodal";

export default function FacultyUser() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [facultyData, setFacultyData] = useState(null);
  const [programData, setProgramData] = useState(null);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const history = useNavigate();
  const formatBirthdate = (birthdate) => {
    const date = new Date(birthdate);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    console.log(facultyData);
  }, [facultyData]);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const data = response.data;
          data.birthdate = formatBirthdate(data.birthdate);
          setFacultyData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        setProgramData(response.data);
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Call the fetchProgramData function when the component mounts
    fetchProgramData();
  }, []);

  
  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    Cookies.remove("facultyEmail");
    setFacultyData(null);
    history("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
const handleModalClose = async () => {
  try {
    // Fetch the updated user data directly from the server
    const response = await axios.get(
      `${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`
    );

    const updatedUser = response.data;
    updatedUser.birthdate = formatBirthdate(updatedUser.birthdate);

    setFacultyData(updatedUser);
    console.log("Modal closed successfully!");
  } catch (error) {
    console.error("Error fetching updated user data:", error);
  }

  // Close the modal
  setIsModalOpen(false);
};

  return (
    <Flex
      minHeight="100vh"
      w="100%"
      position="absolute"
      justifyContent="center"
      zIndex={-1}
    >
      <FacultyNavbar />
      <VStack gap="6" mt="9rem" width="80%">
        <HStack justifyContent="space-between" w="100%">
          <Box>
            <Text fontSize="25px" fontWeight="bold">
              Personal Data
            </Text>
          </Box>
          <Button gap="2rem" onClick={handleOpenModal}>
            <FaUserEdit />
          </Button>
        </HStack>
        {isModalOpen && (
          <FacultyModal isOpen={isModalOpen} onClose={handleModalClose} />
        )}
        <Box
          w="100%"
          borderRadius="25px"
          boxShadow="2xl"
          bg="gray.50"
          padding={{ base: "1rem", md: "3rem" }}
        >
          <VStack alignItems="flex-start" textAlign="left" gap="1rem">
            <HStack gap="3.7rem">
              <Text fontSize="20px" fontWeight="semibold">
                Name:
              </Text>
              <Text fontSize="18px">
                {facultyData
                  ? `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
                  : ""}
              </Text>
            </HStack>
            <HStack gap="2.9rem">
              <Text fontSize="20px" fontWeight="semibold">
                Gender:
              </Text>
              <Text fontSize="18px">
                {facultyData ? facultyData.gender : ""}
              </Text>
            </HStack>
            <HStack gap="3.8rem">
              <Text fontSize="20px" fontWeight="semibold">
                Email:
              </Text>
              <Text fontSize="18px">
                {facultyData ? facultyData.email : ""}
              </Text>
            </HStack>
            <HStack gap="1.5rem">
              <Text fontSize="20px" fontWeight="semibold">
                Birthdate:
              </Text>
              <Text fontSize="18px">
                {facultyData ? facultyData.birthdate : ""}
              </Text>
            </HStack>
            <HStack justifyContent="space-between" flexWrap="wrap" w="100%">
              <HStack gap="2rem" flexWrap="wrap">
                <Text fontSize="20px" fontWeight="semibold">
                  Program:{" "}
                </Text>
                <Box>
                  <Text fontSize="18px">
                    {facultyData &&
                      programData &&
                      programData.find(
                        (program) =>
                          program.program_id === facultyData.program_id
                      )?.program_name}
                  </Text>
                </Box>
              </HStack>
              <Button ml="auto" onClick={handleLogout}>
                Log out
              </Button>
            </HStack>
          </VStack>
        </Box>
        <Spacer mt="10rem" />
        <Footer />
      </VStack>
      {showLogoutConfirmation && (
        <Modal isOpen={showLogoutConfirmation} onClose={cancelLogout}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Logout Confirmation</ModalHeader>
            <ModalBody>
              <Text>Are you sure you want to log out?</Text>
            </ModalBody>
            <ModalFooter gap="1rem">
              <Button colorScheme="red" onClick={confirmLogout}>
                Yes
              </Button>

              <Button onClick={cancelLogout}>No</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
}
