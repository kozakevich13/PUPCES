import {
  Button,
  Center,
  Flex,
  HStack,
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
import { useEffect, useState } from "react";
import "./customModal.css";
import HistoryAll from "./historyAll";
import HistoryTable from "./historyTable";
import { endPoint } from "../../../config";
function History({
  onClose,
  studentNumber,
  totalCreditUnits,
  validatedTotalUnits,
  remainingCreditUnits,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [programId, setProgramId] = useState();
  const [programAbr, setProgramAbr] = useState("");
  const [startYear, setStartYear] = useState();

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  console.log("Year:", year);
  console.log("Semester:", semester);

  //fetch student
 useEffect(() => {
   const fetchData = async () => {
     try {
       const studentResponse = await axios.get(
         `${endPoint}/students?studentNumber=${studentNumber}`
       );

       const studentData = studentResponse.data;

       if (studentData) {
         setProgramId(studentData.program_id);
         console.log("Student Program ID", studentData.program_id);
       } else {
         console.error("Empty or unexpected response:", studentResponse);
       }
     } catch (error) {
       console.error("Error fetching data:", error);
     }
   };

   fetchData();
 }, [studentNumber]);
useEffect(() => {
  const fetchProgramData = async () => {
    try {
      const response = await axios.get(`${endPoint}/programs`);
      const programs = response.data;

      // Find the program with matching program_id as a number
      const matchedProgram = programs.find(
        (program) => program.program_id === parseInt(programId, 10)
      );

      if (matchedProgram) {
        const programAbbr = matchedProgram.program_abbr;
        // Update state with program_abbr
        setProgramAbr(programAbbr);
      } else {
        console.error("Program not found for program_id:", programId);
      }
    } catch (error) {
      console.error("Error fetching program data:", error);
    }
  };

  // Fetch program data only if programId is defined
  if (programId !== undefined) {
    fetchProgramData();
  }
}, [programId]);

  console.log("Program Abr:", programAbr);

  useEffect(() => {
    setStartYear(studentNumber.substring(0, 4));
    // Log the startYear to check its value
    console.log("startYear:", startYear);
  }, [startYear, studentNumber]);

  return (
    <Flex align="center" justify="center" minH="100vh">
      <Modal
        size="full"
        closeOnOverlayClick={false}
        isOpen={isOpen}
        onClose={handleClose}
      >
        <ModalOverlay />
        <ModalContent justifyContent="center">
          <ModalHeader>Recommendation History</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Center>
              <VStack>
                <Text>Select Year and Semester of the Recommendation:</Text>
                <HStack>
                  <Select
                    size="sm"
                    color="gray.500"
                    placeholder="Year"
                    onChange={(e) => setYear(e.target.value)}
                  >
                    {programAbr.startsWith("D") ? (
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
                    <option value="All Years">All Years</option>
                  </Select>
                  <Select
                    size="sm"
                    color="gray.500"
                    width="15rem"
                    placeholder="Semester"
                    onChange={(e) => setSemester(e.target.value)}
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                    <option value="Summer Semester">Summer Semester</option>

                    <option value="All Semester">All Semester</option>
                  </Select>
                </HStack>
              </VStack>
            </Center>
            {console.log("Debug - Year:", year)}
            {console.log("Debug - Semester:", semester)}

            {year === "All Years" && semester === "All Semester" ? (
              <HistoryAll
                studentNumber={studentNumber}
                totalCreditUnits={totalCreditUnits}
                validatedTotalUnits={validatedTotalUnits}
                remainingCreditUnits={remainingCreditUnits}
              />
            ) : (
              <HistoryTable
                year={year}
                semester={semester}
                studentNumber={studentNumber}
                totalCreditUnits={totalCreditUnits}
                validatedTotalUnits={validatedTotalUnits}
                remainingCreditUnits={remainingCreditUnits}
              />
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}

History.propTypes = {
  onClose: PropTypes.func.isRequired,
  studentNumber: PropTypes.string.isRequired,
  totalCreditUnits: PropTypes.number.isRequired,
  validatedTotalUnits: PropTypes.number.isRequired,
  remainingCreditUnits: PropTypes.number.isRequired,
};

export default History;
