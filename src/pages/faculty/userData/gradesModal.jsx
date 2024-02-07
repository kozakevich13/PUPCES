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
function GradesModal({
  isOpen,
  onClose,
  selectedCourseCode,
  currentGrades,
  studentNumber,

  program,
  strand,
  onSaveSuccess,
}) {
  const [newGrade, setNewGrade] = useState(currentGrades || "");
  console.log("Program in modal:", program);
  console.log("Strand in modal:", strand);

  const getCourseType = (studentNumber) => {
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      return 2019;
    } else {
      // Handle any other cases or provide a default value
      return 2022;
    }
  };
  async function getCourseId(courseCode) {
    try {
      const currentCourseType = getCourseType(studentNumber);
      const response = await axios.get(
        `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
      );

      const courseData = response.data;
      const course = courseData.find(
        (course) => course.course_code === courseCode
      );

      if (course) {
        return course.course_id;
      } else {
        console.error(`Course not found for courseCode: ${courseCode}`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      return null;
    }
  }

  const handleSave = async () => {
    console.log("Student Number passed in gradesmodal:", studentNumber);
    console.log("Selected Course Code:", selectedCourseCode);
    console.log("New Grades:", newGrade);
    console.log("Program:", program);
 
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
      const courseId = await getCourseId(selectedCourseCode);

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
          console.log(`Grades for ${selectedCourseCode} saved successfully.`);

          onClose();

          if (onSaveSuccess) {
            onSaveSuccess(); // Call the callback function to trigger data fetching
          }
        } else {
          console.error(
            `Failed to save grades for ${selectedCourseCode}. Status code: ${response.status}`
          );
        }
      } else {
        console.error(`Failed to get course_id for ${selectedCourseCode}`);
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
        <ModalHeader>Edit Grades for {selectedCourseCode}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <Text>Select new grades:</Text>
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
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

GradesModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedCourseCode: PropTypes.string.isRequired,
  currentGrades: PropTypes.string,
  studentNumber: PropTypes.string.isRequired,
  program: PropTypes.number.isRequired,

  strand: PropTypes.string,
  onSaveSuccess: PropTypes.func,
};

export default GradesModal;
