import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState } from "react";
import axios from "axios";
import { endPoint } from "../../config";
function EditGrades({ onClose, isOpen, selectedCourseCode }) {
  const [grades, setGrades] = useState([]);
  const [remarks, setRemarks] = useState('');
  const toast = useToast(); 

const handleSave = async () => {
  try {
    // Check if grades and remarks are empty
    if (!grades || !remarks) {
      toast({
        title: "Error",
        description: "Please fill in both grades and remarks.",
        status: "error",
        duration: 5000, 
        isClosable: true,
      });
      return; 
    }

 
    const studentNumber = "2020-00222-LQ-0";


    await axios.post(`${endPoint}/grades`, {
      student_number: studentNumber,
      course_id: selectedCourseCode,
      grades: grades,
      remarks: remarks,
    });

    
    toast({
      title: "Grades Saved",
      description: "Your grades will be validated.",
      status: "success",
      duration: 5000, 
      isClosable: true,
    });

    // Clear the input fields
    setGrades("");
    setRemarks("");

    // Close the modal
    onClose();
  } catch (error) {
    console.error("Error saving grades and remarks:", error);
  }
};

       
    

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Grade</FormLabel>
            <Input
              value={grades}
              onChange={(e) => setGrades(e.target.value)}
              placeholder="Grade"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Remarks</FormLabel>
            <Input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Remark"
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" mr={3} onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default EditGrades;

EditGrades.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  selectedCourseCode: PropTypes.string.isRequired,
};
EditGrades.defaultProps = {
  selectedCourseCode: "",
};


