import {
  Box,
  Button,
  Link as ChakraLink,
  Flex,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaUserEdit } from "react-icons/fa";
import InitialsAvatar from "react-initials-avatar";
import { Link as RouterLink } from "react-router-dom";
import AdminModal from "./adminUserModal";
import PUP from "../../assets/PUPlogo.png";
import { endPoint } from "../config";

function AdminUser() {
  const [adminData, setAdminData] = useState(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${endPoint}/admin`);
        setAdminData(response.data[0]);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      }
    };

    fetchAdminData();
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirmation(true);
  };

  const confirmLogout = () => {
    history("/");
  };

  const cancelLogout = () => {
    setShowLogoutConfirmation(false);
  };

  const handleModalClose = async () => {
    try {
      const response = await axios.get(`${endPoint}/admin`);
      setAdminData(response.data[0]);
    } catch (error) {
      console.error("Error fetching updated user data:", error);
    }
    // Close the modal
    setIsModalOpen(false);
  }




  return (
    <Box
      mt="0"
      mb="0"
      //  flexGrow={1}
      w="100%"
      minW="100vw"
      h="100vh"
      bgColor="#F8F8F8"
      display="flex"
      flexDirection="column"
      padding=" 2rem 0 0 0"
      // overflowY="auto"
    >
      <HStack justifyContent="space-between">
        <ChakraLink
          as={RouterLink}
          to="/admin" // Specify the correct route path
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <HStack ml="6rem" padding="0 10rem 0" cursor="pointer">
            <Image
              src={PUP}
              alt="PUP Logo"
              boxSize="60px"
              objectFit="contain"
            />
            <Text fontWeight="semibold">PUP Curriculum Evaluation System</Text>
          </HStack>
        </ChakraLink>
        <ChakraLink
          as={RouterLink}
          to="/adminuser"
          _hover={{ textDecoration: "none", color: "black" }}
          _focus={{ outline: "none" }}
        >
          <div
            style={{
              marginRight: "15rem",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#740202",
              color: "#E5F4E2",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <InitialsAvatar name="Admin" />
          </div>
        </ChakraLink>
      </HStack>
      <Flex h="100vh" position="absolute" w="100%" justifyContent="center">
        <VStack gap="6" mt="9rem">
          <HStack>
            <Box mr="35rem">
              <Text fontSize="25px" fontWeight="bold">
                Personal Data
              </Text>
            </Box>
            <Button gap="2rem" ml="7.5rem" onClick={() => setIsModalOpen(true)}>
              <FaUserEdit />
            </Button>
          </HStack>
          {isModalOpen && <AdminModal onClose={handleModalClose} />}

          {adminData && (
            <Box
              w="65rem"
              h="12rem"
              borderRadius="25px"
              boxShadow="2xl"
              bg="gray.50"
              padding="3rem 5rem"
            >
              <VStack alignItems="flex-start" textAlign="left" gap="1rem">
                <HStack gap="4rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Name:
                  </Text>
                  <Text fontSize="18px" width="12rem">
                    {adminData.admin_fname && adminData.admin_fname + " "}
                    {adminData.admin_mname && adminData.admin_mname + " "}
                    {adminData.admin_lname}
                  </Text>
                </HStack>
                <HStack gap="4rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Email:
                  </Text>
                  <Text>{adminData.admin_email}</Text>
                </HStack>
              </VStack>
              <Button ml="42rem" mt="-2rem" onClick={handleLogout}>
                Log out
              </Button>
            </Box>
          )}
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
    </Box>
  );
}

export default AdminUser;
