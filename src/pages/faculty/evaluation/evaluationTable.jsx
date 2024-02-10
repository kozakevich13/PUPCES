import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import UsersEvaluation from "./usersEvaluation/usersEvaluation";
import { endPoint } from "../../config";
function EvaluationTable({ students, isLoading, showTableBody }) {
  const [programAbbr, setProgramAbbr] = useState("");
  const [evalYear, setEvaluationYear] = useState({});
  const [evalSem, setEvaluationSem] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const [showUsersEvaluation, setShowUsersEvaluation] = useState(false);
  const [startYear, setStartYear] = useState();

  const openModal = (studentNumber) => {
    setSelectedStudentNumber(studentNumber);
    setStartYear(studentNumber.substring(0, 4));
    console.log("startYear after update:", studentNumber.substring(0, 4));

    if (evalYear[studentNumber] && evalSem[studentNumber]) {
      // If evalYear and evalSem are already set, show UsersEvaluation directly
      setShowUsersEvaluation(true);
    } else {
      // Otherwise, open the modal
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    // Log the startYear to check its value
    console.log("startYear:", startYear);
  }, [startYear]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudentNumber(null);
  };

  const handleSelectButtonClick = () => {
    // Check if evalYear and evalSem are set for the selected student
    if (evalYear[selectedStudentNumber] && evalSem[selectedStudentNumber]) {
      // Set showUsersEvaluation to true
      setShowUsersEvaluation(true);

      // Close the modal
      closeModal();
    }
  };

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        students.forEach(async (student) => {
          // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
          const selectedProgram = programs.find(
            (programTable) => programTable.program_id === student.program_id
          );

          console.log("Selected Program:", selectedProgram);

          if (selectedProgram) {
            const program_abbr = selectedProgram.program_abbr;
            console.log("Program Abbreviation:", program_abbr);
            setProgramAbbr(program_abbr);
            console.log("Program Abbreviation has been set:", program_abbr);
          } else {
            console.error(
              "Program not found for student:",
              student.student_number
            );
          }
        });
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [students]);

  return (
    <Flex w="90vw" overflow="visible">
      <VStack w="100%">
        <TableContainer w="100%" marginTop="2rem">
          <Table
            variant="simple"
            fontFamily="bitter"
            size="sm"
            overflowX="auto"
          >
            <Thead bg="palette.primary" marginBottom="5rem" h="3rem">
              <Tr>
                <Th color="palette.secondary">Student Number</Th>
                <Th color="palette.secondary">First Name</Th>
                <Th color="palette.secondary">Middle Name</Th>
                <Th color="palette.secondary">Last Name</Th>
                <Th color="palette.secondary">Program</Th>
                <Th color="palette.secondary">Strand</Th>
                <Th color="palette.secondary">Status</Th>
                <Th color="palette.secondary">Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {showTableBody && students.length === 0 ? (
                <Tr>
                  <Td colSpan="3">No results found.</Td>
                </Tr>
              ) : isLoading ? (
                <Tr>
                  <Td colSpan="3">Loading...</Td>
                </Tr>
              ) : showTableBody ? (
                students.map((student) => (
                  <Tr key={student.student_number} style={{ height: "4rem" }}>
                    <Td>{student.student_number} </Td>
                    <Td>{student.first_name}</Td>
                    <Td>{student.middle_name}</Td>
                    <Td>{student.last_name}</Td>
                    <Td>{programAbbr}</Td>
                    <Td>{student.strand}</Td>
                    <Td>{student.status}</Td>
                    <Td>
                      <Button onClick={() => openModal(student.student_number)}>
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))
              ) : null}
            </Tbody>
          </Table>
          <Modal
            size="xl"
            closeOnOverlayClick={false}
            isOpen={isModalOpen}
            onClose={closeModal}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Select First the Year and Semester you are evaluating for{" "}
                {selectedStudentNumber}
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Select
                  placeholder="Academic Year"
                  value={evalYear[selectedStudentNumber] || ""}
                  onChange={(event) =>
                    setEvaluationYear({
                      ...evalYear,
                      [selectedStudentNumber]: event.target.value,
                    })
                  }
                >
                  {programAbbr.startsWith("D") ? (
                    <>
                      <option value="1">
                        {startYear}-{Number(startYear) + 1}
                      </option>
                      <option value="2">
                        {Number(startYear) + 1}-{Number(startYear) + 2}
                      </option>
                      <option value="3">
                        {Number(startYear) + 2}-{Number(startYear) + 3}
                      </option>
                    </>
                  ) : (
                    <>
                      <option value="1">
                        {startYear}-{Number(startYear) + 1}
                      </option>
                      <option value="2">
                        {Number(startYear) + 1}-{Number(startYear) + 2}
                      </option>
                      <option value="3">
                        {Number(startYear) + 2}-{Number(startYear) + 3}
                      </option>
                      <option value="4">
                        {Number(startYear) + 3}-{Number(startYear) + 4}
                      </option>
                      <option value="5">
                        {Number(startYear) + 4}-{Number(startYear) + 5}
                      </option>
                      <option value="6">
                        {Number(startYear) + 5}-{Number(startYear) + 6}
                      </option>
                    </>
                  )}
                </Select>
                <Select
                  mt="2rem"
                  placeholder="Semester"
                  value={evalSem[selectedStudentNumber] || ""}
                  onChange={(event) =>
                    setEvaluationSem({
                      ...evalSem,
                      [selectedStudentNumber]: event.target.value,
                    })
                  }
                >
                  <option value="First Semester">First Semester</option>
                  <option value="Second Semester">Second Semester</option>
                  <option value="Summer Semester">Summer Semester</option>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={handleSelectButtonClick}
                  isDisabled={
                    !evalSem[selectedStudentNumber] ||
                    !evalYear[selectedStudentNumber]
                  }
                >
                  Select
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          {/* Conditional rendering of UsersEvaluation */}
        </TableContainer>

        {showUsersEvaluation &&
          selectedStudentNumber &&
          evalYear[selectedStudentNumber] &&
          evalSem[selectedStudentNumber] && (
            <UsersEvaluation
              // programAbbr =
              studentNumber={selectedStudentNumber}
              evalYearValue={evalYear[selectedStudentNumber]}
              evalSemValue={evalSem[selectedStudentNumber]}
            />
          )}
      </VStack>
    </Flex>
  );
}

EvaluationTable.propTypes = {
  students: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  showTableBody: PropTypes.bool.isRequired,
};

export default EvaluationTable;
