import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useState } from "react";
import { endPoint } from "../../config";

const ModalComponent = ({
  isOpen,
  onClose,
  courseCode,
  currentGrade,
  courseId,
  studentNumber,
  onSaveSuccess,
}) => {
  const [newGrade, setNewGrade] = useState(currentGrade || "");

  console.log("Current Grade", currentGrade);
  console.log("Course ID", courseId);

  const handleSave = async () => {
    console.log("Student Number passed in gradesmodal:", studentNumber);

    let remarks = "";

    if (newGrade === "0") {
      remarks = "Withdraw";
    } else if (newGrade === "-1") {
      remarks = "Incomplete";
    } else if (parseFloat(newGrade) >= 1.0 && parseFloat(newGrade) <= 3.0) {
      remarks = "P";
    } else if (newGrade === "5.00") {
      remarks = "F";
    }

    try {
      if (courseId !== null) {
        console.log("Request Payload:", {
          studentNumber: studentNumber,
          course_id: courseId,
          grades: newGrade,
          remarks: remarks,
        });

        const response = await axios.put(`${endPoint}/update-grades`, {
          studentNumber: studentNumber,
          course_id: courseId,
          grades: newGrade,
          remarks: remarks,
        });

        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);

        if (response.status === 200) {
          console.log(`Grades for ${courseCode} saved successfully.`);

          onClose();
          if (onSaveSuccess) {
            onSaveSuccess(remarks); // Call the callback function to trigger data fetching
          }
        } else {
          console.error(
            `Failed to save grades for ${courseCode}. Status code: ${response.status}`
          );
        }
      } else {
        console.error(`Failed to get course_id for ${courseCode}`);
      }
    } catch (error) {
      console.error("Error updating grades:", error);
      // Log the full error object
      console.error(error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submit another grades for {courseCode}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>Select new grade:</Text>
            <Select
              value={newGrade}
              onChange={(e) => setNewGrade(e.target.value)}
            >
              <option value="1.00">1.00</option>
              <option value="1.25">1.25</option>
              <option value="1.50">1.50</option>
              <option value="1.75">1.75</option>
              <option value="2.00">2.00</option>
              <option value="2.25">2.25</option>
              <option value="2.50">2.50</option>
              <option value="2.75">2.75</option>
              <option value="3.00">3.00</option>
              <option value="5.00">5.00</option>
              <option value="0">Withdraw</option>
              <option value="-1">Incomplete</option>
            </Select>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={handleSave}>
            Submit
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
ModalComponent.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  courseCode: PropTypes.string.isRequired,
  currentGrade: PropTypes.string.isRequired,
  courseId: PropTypes.string.isRequired,
  studentNumber: PropTypes.string.isRequired,
  onSaveSuccess: PropTypes.func,
};

export default ModalComponent;
