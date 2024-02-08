import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Flex,
  HStack,
  Select,
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
import { useEffect, useRef, useState } from "react";
import { endPoint } from "../../../config";

function Evaluated() {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [evaluated, setEvaluated] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyId, setFacultyId] = useState();
  const [facultyprogram, setFacultyProgram] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

          setFacultyId(facultyData.faculty_id);
          setFacultyProgram(facultyData.program_id);
          console.log("Faculty ID in evaluated:", facultyData.faculty_id);
          console.log("Faculty Program in evaluated:", facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //fetch evaluate
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/evaluate-faculty?faculty_id=${facultyId}`
        );
        // Get unique combinations of student number and date
        console.log("response", response.data);
        const uniqueRecords = await Promise.all(
          Array.from(
            new Set(
              response.data.map(
                (item) =>
                  `${item.student_number}_${item.eval_sem}_${item.date_eval}`
              )
            )
          ).map(async (key) => {
            const [studentNumber, evalSem, dateEval] = key.split("_");
            const studentEvaluation = response.data.find(
              (item) =>
                item.student_number === studentNumber &&
                item.eval_sem === evalSem &&
                item.date_eval === dateEval
            );

            // Fetch additional student information using student_number
            const studentInfoResponse = await axios.get(
              `${endPoint}/students/${studentNumber}`
            );

            return {
              ...studentEvaluation,
              ...studentInfoResponse.data,
            };
          })
        );

        setEvaluated(uniqueRecords);

        console.log("Evaluate Response:", uniqueRecords);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [facultyId]);

  //Download
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
      filename: "failedgrades.pdf",
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

  const filteredEvaluated = evaluated.filter((evaluation) => {
    const isSemesterMatch =
      !selectedSemester || evaluation.eval_sem === selectedSemester;
    const isYearLevelMatch =
      !selectedYearLevel ||
      evaluation.eval_year === parseInt(selectedYearLevel);

    return isSemesterMatch && isYearLevelMatch;
  });
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
      <div ref={containerRef}>
        <Flex justify="space-between" align="center">
          <CardHeader>List of Evaluated Students</CardHeader>
          <HStack
            spacing={{ base: "1rem", sm: "2rem" }}
            justifyContent={{ base: "center", sm: "flex-start" }}
            flexWrap="wrap"
          >
            <Select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              placeholder="Semester"
              w={{ base: "100%", sm: "10rem" }}
              mb={{ base: "0.5rem", sm: "0" }}
              mt="1rem"
              mr="1rem"
              ml="auto"
            >
              <option value="First Semester">First Semester</option>
              <option value="Second Semester">Second Semester</option>
            </Select>
            <Select
              value={selectedYearLevel}
              onChange={(e) => setSelectedYearLevel(e.target.value)}
              placeholder="Year Level"
              w={{ base: "100%", sm: "10rem" }}
              mr="1rem"
              mt={isSmallScreen ? "0" : "1rem"}
              ml="auto"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </Select>
            <Button
              mr="2rem"
              mt={isSmallScreen ? "0" : "1rem"}
              ml="auto"
              colorScheme="teal"
              style={{
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#43766C";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#43766C";
                e.currentTarget.style.transform = "scale(1)";
              }}
              onClick={handleDownloadPDF}
            >
              Download
            </Button>
          </HStack>
        </Flex>
        <Divider bg="gray.300" />
        <CardBody justifyContent="center">
          <TableContainer>
            <Table>
              <Thead bg="palette.primary" h="2rem">
                <Tr>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    <div>Student</div>
                    <div>Number</div>
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Name
                  </Th>

                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Semester
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    <div>Academic</div>
                    <div>Year</div>
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    <div>Date</div>
                  </Th>
                </Tr>
              </Thead>

              <Tbody>
                {(selectedSemester && filteredEvaluated.length > 0) ||
                (selectedYearLevel && filteredEvaluated.length > 0) ? (
                  filteredEvaluated.map((evaluation) => (
                    <Tr key={evaluation.evaluate_id}>
                      <Td style={{ textAlign: "center" }} fontSize="12px">
                        <div>{evaluation.student_number}</div>
                      </Td>
                      <Td style={{ textAlign: "center" }} fontSize="12px">
                        <div>{`${evaluation.first_name} ${evaluation.middle_name} ${evaluation.last_name}`}</div>
                      </Td>
                      <Td style={{ textAlign: "center" }} fontSize="12px">
                        {evaluation.eval_sem}
                      </Td>
                      <Td style={{ textAlign: "center" }} fontSize="12px">
                        {evaluation.eval_year}
                      </Td>
                      <Td style={{ textAlign: "center" }} fontSize="12px">
                        {formatDate(evaluation.date_eval)}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Tr>
                    <Td colSpan={5} textAlign="center" fontSize="12px">
                      Select Semester or Year Level
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </div>
    </Card>
  );
}

export default Evaluated;
