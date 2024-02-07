import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

import { endPoint } from "../../config";

function FacultyTable({
  students,
  isLoading,
  handleStudentNumberClick,
  showTableBody,
  toggleUsersData,
}) {
  const [programData, setProgramData] = useState([]);

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${endPoint}/programs`);
        if (response.ok) {
          const data = await response.json();
          setProgramData(data);
        } else {
          console.error("Failed to fetch program data");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgram();
  }, []);

  // Function to get the program name from the programData array
  const getProgramName = (programId) => {
    const program = programData.find((p) => p.program_id === programId);
    return program ? program.program_abbr : " ";
  };

  return (
    <TableContainer w="100%" marginTop="2rem">
      <Table variant="simple" fontFamily="bitter" size="sm">
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
                <Td
                  onClick={() => {
                    console.log(
                      "Student Number of row:",
                      student.student_number
                    );
                    handleStudentNumberClick(student.student_number);
                  }}
                >
                  {student.student_number}{" "}
                </Td>
                <Td>{student.first_name}</Td>
                <Td>{student.middle_name}</Td>
                <Td>{student.last_name}</Td>
                <Td>{getProgramName(student.program_id)}</Td>
                <Td>{student.strand}</Td>
                <Td>{student.status}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      console.log(
                        "Student Number Clicked:",
                        student.student_number
                      );
                      toggleUsersData(student.student_number);
                    }}
                  >
                    View
                  </Button>
                </Td>
              </Tr>
            ))
          ) : null}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

FacultyTable.propTypes = {
  students: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleStudentNumberClick: PropTypes.func.isRequired,
  showTableBody: PropTypes.bool.isRequired,
  toggleUsersData: PropTypes.func.isRequired,
  selectedStudentNumber: PropTypes.string,
};

export default FacultyTable;
