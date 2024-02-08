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
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { endPoint } from "../../../config";

function FailedGrades() {
  const [failedGradesData, setFailedGradesData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [matchedData, setMatchedData] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYearLevel, setSelectedYearLevel] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 600);

  const [curriculumMap, setCurriculumMap] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const failedGradesResponse = await axios.get(
          `${endPoint}/failedgrades`
        );
        setFailedGradesData(failedGradesResponse.data);
        console.log("Failed Grades Data:", failedGradesResponse);

        const studentsResponse = await axios.get(`${endPoint}/students/all`);
        setStudents(studentsResponse.data);
        console.log("Students Data:", studentsResponse.data);

        const coursesResponse = await axios.get(`${endPoint}/curriculum/all`);
        setCourses(coursesResponse.data);

        const newCurriculumMap = new Map(
          courses.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);

        console.log("Courses Data:", coursesResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 600);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Match students with failed grades based on student_number
    const updatedMatchedData = failedGradesData.map((failedGrade) => {
      const matchedStudent = students.find(
        (student) => student.student_number === failedGrade.student_number
      );

      const matchedCourse = courses.find(
        (course) => course.course_id === failedGrade.course_id
      );

      return {
        ...failedGrade,
        matchedStudent: matchedStudent || null,
        course_code: matchedCourse ? matchedCourse.course_code : null,
        course_title: matchedCourse ? matchedCourse.course_title : null,
        pre_requisite: matchedCourse ? matchedCourse.pre_requisite : null,
        course_year: matchedCourse ? matchedCourse.course_year : null,
        course_sem: matchedCourse ? matchedCourse.course_sem : null,
      };
    });

    console.log("Updated Matched Data:", updatedMatchedData);
    setMatchedData(updatedMatchedData);
  }, [failedGradesData, students, courses]);

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

  const renderPrerequisites = (prerequisites) => {
    if (!prerequisites || !curriculumMap.size) return null;

    const prerequisiteList = prerequisites.split(",");

    return (
      <>
        {prerequisiteList.map((prerequisite, index) => {
          // Extracting the course code from the prerequisite (assuming format "course_code")
          const prerequisiteCode = prerequisite.trim();

          // Getting the corresponding course title from the curriculumMap
          const courseTitle = curriculumMap.get(prerequisiteCode);

          // Displaying the course title in the tooltip
          return (
            <Tooltip key={index} label={courseTitle} hasArrow>
              <div>{prerequisiteCode}</div>
            </Tooltip>
          );
        })}
      </>
    );
  };

  const shouldDisplayData = selectedYearLevel && selectedSemester;

  const filteredData = matchedData.filter((data) => {
    return (
      String(data.course_year) === selectedYearLevel &&
      data.course_sem === selectedSemester
    );
  });

  return (
    <Card mt="2rem" w="100%" h="auto" boxShadow="2xl" borderRadius="30px">
      <div ref={containerRef}>
        <Flex justify="space-between" align="center">
          <CardHeader>Student(s) that have Failing Grades</CardHeader>
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
              mb={{ base: "1rem", sm: "0" }}
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
              w="10rem"
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
              // ml={isSmallScreen ? "auto" : "0"}
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
                    <div>Course</div>
                    <div>Code</div>
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Course Title
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Prerequisite
                  </Th>
                  <Th
                    style={{ textAlign: "center" }}
                    fontSize="10px"
                    color="palette.secondary"
                  >
                    Grades
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
                </Tr>
              </Thead>

              <Tbody>
                {shouldDisplayData ? (
                  filteredData.map((data) => (
                    <Tr key={uuidv4()}>
                      {/* Use uuidv4() to generate unique keys */}
                      <Td fontSize="12px">
                        {data.matchedStudent?.student_number}
                      </Td>
                      <Td fontSize="12px">{`${data.matchedStudent?.first_name} ${data.matchedStudent?.last_name}`}</Td>
                      <Td fontSize="12px">{data.course_code}</Td>
                      <Td
                        className="course-title-cell"
                        fontStyle="bitter"
                        fontSize="12px"
                      >
                        {data.course_title}
                      </Td>
                      <Td fontSize="12px">
                        {renderPrerequisites(data.pre_requisite)}
                      </Td>
                      <Td fontSize="12px" textAlign="center">
                        {data.grades === -1 ? "Incomplete" : data.grades}
                      </Td>

                      <Td className="course-title-cell" fontSize="12px">
                        {data.course_sem}
                      </Td>
                      <Td className="course-title-cell" fontSize="12px">
                        {`${data.matchedStudent?.student_number.substring(
                          0,
                          4
                        )} - ${
                          parseInt(
                            data.matchedStudent?.student_number.substring(0, 4)
                          ) + parseInt(data.course_year)
                        }`}
                      </Td>
                    </Tr>
                  ))
                ) : (
                  <Td colSpan={8} textAlign="center" fontSize="12px">
                    Please select both year level and semester
                  </Td>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </CardBody>
      </div>
    </Card>
  );
}

export default FailedGrades;
