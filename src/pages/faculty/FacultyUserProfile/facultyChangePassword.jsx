import {
  Button,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useState } from "react";
import { endPoint } from "../../config";

import { FaEye, FaEyeSlash } from "react-icons/fa";

function FacultyChangePassword({ isOpen, onClose }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  const toast = useToast();

  const buttonStyles = {
    background: "none",
    border: "none",
    padding: "0",
    cursor: "pointer",
    outline: "none",
  };

  const handleSave = async () => {
    try {
      const response = await axios.get(
        `${endPoint}/faculty/password/${facultyEmail}`
      );
      const facultyPassword = response.data.faculty_password;
      console.log("Faculty password in db", response.data.faculty_password);

      if (oldpassword !== facultyPassword) {
        toast({
          title: "Error",
          description: "Wrong password. Please enter the correct old password",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "top",
        });

        return;
      }
      // If the old password matches, update the password in the database
      await axios.put(
        `${endPoint}/updatefacultypassword/${encodeURIComponent(facultyEmail)}`,
        {
          faculty_password: newpassword,
        }
      );

      onClose();

      // Show a success toast
      toast({
        title: "Password Change",
        description: "Password updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error fetching faculty password:", error);
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent>
        <ModalHeader>Change Password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack>
            <HStack gap="2rem">
              <HStack>
                <Text>Old</Text>
                <Text>Password:</Text>
              </HStack>
              <InputGroup size="md">
                <Input
                  bg="palette.secondary"
                  pr="4.5rem"
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Old Password"
                  color="palette.primary"
                  w="21rem"
                  value={oldpassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    _hover={{ background: "none", border: "none" }}
                    _focus={{ background: "none", border: "none" }}
                    _active={{ background: "none", border: "none" }}
                    style={buttonStyles}
                    onClick={() => setShowOldPassword(!showOldPassword)}
                  >
                    {showOldPassword ? (
                      <FaEye color="palette.primary" />
                    ) : (
                      <FaEyeSlash color="palette.primary" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </HStack>
            {/* New Password */}
            <HStack gap="2rem">
              <HStack>
                <Text>New</Text>
                <Text>Password:</Text>
              </HStack>
              <InputGroup size="md">
                <Input
                  bg="palette.secondary"
                  pr="4.5rem"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  color="palette.primary"
                  w="21rem"
                  value={newpassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    _hover={{ background: "none", border: "none" }}
                    _focus={{ background: "none", border: "none" }}
                    _active={{ background: "none", border: "none" }}
                    style={buttonStyles}
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <FaEye color="palette.primary" />
                    ) : (
                      <FaEyeSlash color="palette.primary" />
                    )}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </HStack>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={4} justify="flex-end">
            <Button colorScheme="blue" onClick={handleSave}>
              Save
            </Button>
            <Button colorScheme="teal" onClick={onClose}>
              Cancel
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

FacultyChangePassword.propTypes = {
  onClose: PropTypes.func,
  isOpen: PropTypes.bool,
};

export default FacultyChangePassword;
