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
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import html2pdf from "html2pdf.js";
import PropTypes from "prop-types";
import { useRef } from "react";

function ListPerYearModal({ isOpen, onClose, students, selectedLabel }) {
  // Separate students based on gender
  console.log("Selected Label in LstPerYearModal:", selectedLabel);
  const maleStudents = students.filter((student) => student.gender === "Male");
  const femaleStudents = students.filter(
    (student) => student.gender === "Female"
  );

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");
    console.log("Container reference:", element);
    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "classlist.pdf",
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <div ref={containerRef}>
          <ModalHeader>Class List of {selectedLabel}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing="4rem" alignItems="start">
              <Text fontWeight="semibold">Male:</Text>

              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Student Number</Th>
                      <Th>Name</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {maleStudents.map((student) => (
                      <Tr key={student.id}>
                        <Td> {`${student.student_number}`}</Td>
                        <Td>{`${student.first_name} ${student.last_name}`}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>

              <Text fontWeight="semibold">Female:</Text>
              <TableContainer>
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Student Number</Th>
                      <Th>Name</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {femaleStudents.map((student) => (
                      <Tr key={student.id}>
                        <Td> {`${student.student_number}`}</Td>
                        <Td>{`${student.first_name} ${student.last_name}`}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </VStack>
          </ModalBody>
        </div>

        <ModalFooter>
          <Button  mr="1rem"colorScheme="green" onClick={handleDownloadPDF}>
            Download PDF
          </Button>
          <Button  mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

ListPerYearModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  selectedLabel: PropTypes.string.isRequired,
  students: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired, // Add gender prop type
      // Add additional prop types for your student data structure
    })
  ).isRequired,
};

export default ListPerYearModal;
