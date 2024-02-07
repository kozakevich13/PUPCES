import {
    Button,
    HStack,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import AdminChangePassword from "./adminChangePassword";
import { endPoint } from "../config";

function AdminModal({ onClose }) {
  const [firstName, setFirstName] = useState("");
   const [adminData, setAdminData] = useState(null);
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
    useState(false);

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true);
  };

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false);
  };

 useEffect(() => {
   const fetchAdminData = async () => {
     try {
       const response = await axios.get(`${endPoint}/admin`);
       const user = response.data[0];
       console.log(response.data[0]);
       setFirstName(user.admin_fname || "");
       setMiddleName(user.admin_mname || "");
       setLastName(user.admin_lname || "");
       setEmail(user.admin_email || "");
       setAdminData(user);
     } catch (error) {
       console.error("Error fetching admin data:", error);
     }
   };

   
   fetchAdminData();
 }, []);


 const handleSave = async () => {
    try {
      const response = await axios.put(`${endPoint}/updateadmin`, {
        admin_fname: firstName,
        admin_mname: middleName,
        admin_lname: lastName,
        admin_email: email,
      });
    
   
      // Log the response (You might want to handle it differently)
      console.log("User data updated:", response.data);
      onClose(response.data.updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
 }



  return (
    <Modal isOpen={true} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit</ModalHeader>
        <ModalCloseButton />
        <ModalBody justifyContent="flex-start" alignItems="flex-start">
          <VStack spacing={2.5} alignItems="flex-start">
            <HStack gap="3rem">
              <HStack fontWeight="semibold">
                <Text>First</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.2rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="2rem">
              <HStack fontWeight="semibold">
                <Text>Middle</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.4rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="2.2rem">
              <HStack fontWeight="semibold">
                <Text>Last</Text>
                <Text>Name:</Text>
              </HStack>

              <Input
                ml="1rem"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                  width: "25rem",
                }}
              />
            </HStack>
            <HStack gap="4rem">
              <Text fontWeight="semibold">Email:</Text>
              <Input
                ml="1.8rem"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "25rem",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              />
            </HStack>
            <Button onClick={handleOpenChangePasswordModal}>
              Change Password
            </Button>
          </VStack>
        </ModalBody>
        <ModalFooter>
          {" "}
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
      {isChangePasswordModalOpen && (
        <AdminChangePassword
          isOpen={isChangePasswordModalOpen}
          onClose={handleCloseChangePasswordModal}
        />
      )}
    </Modal>
  );
}

AdminModal.propTypes = {
  onClose: PropTypes.func,
};
export default AdminModal;
