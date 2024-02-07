import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { endPoint } from "../../../config";

function MaleStudents({ isOpen, onClose }) {
  const [facultyProgram, setFacultyProgram] = useState([]);
  const [students, setStudents] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");

  console.log("faculty email in cookies in totalstudent:", facultyEmail);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyProgram(facultyData.program_id);
          console.log("Faculty Program:", facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    // Fetch and count all students with the specified program_id
    if (facultyProgram) {
      axios
        .get(`${endPoint}/students/all`)
        .then((response) => {
          const allStudents = response.data;

          const studentsWithProgramId = allStudents.filter(
            (student) => student.program_id === facultyProgram
          );

          // Update year level based on student number
          const updatedStudents = studentsWithProgramId.map((student) => ({
            ...student,
            year_level: calculateYearLevel(student.student_number),
          }));

          console.log("studentsWithProgramId", updatedStudents);
          setStudents(updatedStudents);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyProgram]);

  useEffect(() => {
    console.log("students", students);
  }, [students]);
  const calculateYearLevel = (studentNumber) => {
    const firstFourDigits = parseInt(studentNumber.substring(0, 4));
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const yearLevelAdjustment = currentMonth < 9 ? -1 : 0;
    const yearLevel = currentYear - firstFourDigits + 1 + yearLevelAdjustment;
    return yearLevel;
  };

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");

    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "malestudents.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    }).then(() => {
      if (table) {
        table.style.width = ""; // Reset to default width
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <div ref={containerRef}>
          <ModalHeader>Male Students</ModalHeader>
          <ModalBody>
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>Student Number</Th>
                    <Th>Name</Th>
                    <Th>Gender</Th>
                    <Th>Year Level</Th>
                    <Th>Status</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {students
                    .filter((student) => student.gender === "Male")
                    .map((student) => (
                      <Tr key={uuidv4()}>
                        <Td>{student.student_number}</Td>
                        <Td>{`${student.first_name} ${student.last_name}`}</Td>
                        <Td>{student.gender}</Td>
                        <Td textAlign="center">
                          {student.year_level >= 5 ? "" : student.year_level}
                        </Td>
                        <Td>{student.status}</Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </ModalBody>
        </div>
        <ModalFooter>
          <Button
            mr="1rem"
            style={{
              backgroundColor: "#740202",
              // justifyContent: "flex-end",
              // marginLeft: "50rem",
              color: "white",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#950303";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#740202";
              e.currentTarget.style.transform = "scale(1)";
            }}
            onClick={handleDownloadPDF}
          >
            Download
          </Button>
          <Button colorScheme="blue" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
        <ModalCloseButton />
      </ModalContent>
    </Modal>
  );
}
MaleStudents.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default MaleStudents;
