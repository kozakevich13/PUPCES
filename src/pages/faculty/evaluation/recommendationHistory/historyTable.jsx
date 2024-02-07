import {
  Button,
  Flex,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
} from "@chakra-ui/react";
import React from "react";

import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import NoEval from "../../../../assets/noEval.json";
import { endPoint } from "../../../config";

function HistoryTable({
  studentNumber,
  year,
  semester,
  totalCreditUnits,
  validatedTotalUnits,
  remainingCreditUnits,
}) {
  const [startYear, setStartYear] = useState();
  const [evaluationData, setEvaluationData] = useState([]);
  const [student, setStudent] = useState({});
  const [programId, setProgramId] = useState("");
  const [strand, setStrand] = useState("");
  const [curriculumData, setCurriculumData] = useState([]);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [facultyData, setFacultyData] = useState(null);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);
  console.log("Year in Table:", year);
  console.log("Semester in Table:", semester);
  console.log("Student Number:", studentNumber);
  const [curriculumMap, setCurriculumMap] = useState(new Map());

  const getCourseType = (studentNumber) => {
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      return "Old";
    } else {
      // Handle any other cases or provide a default value
      return 2022;
    }
  };
  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return "";
  };

  //fetch faculty
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const data = response.data;

          setFacultyData(data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  //fetch evaluate
  useEffect(() => {
    axios
      .get(
        `${endPoint}/evaluate-recommend?student_number=${studentNumber}&eval_year=${year}&eval_sem=${semester}`
      )
      .then((response) => {
        console.log("API Response:", response.data); // Log the API response
        setEvaluationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setEvaluationData([]);
      });
  }, [semester, studentNumber, year]);
  console.log("Evaluation Data:", evaluationData);

  //fetch curriculum
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const currentCourseType = getCourseType(studentNumber);
        console.log(currentCourseType);
        const response = await axios.get(
          `${endPoint}/curriculum?program_id=${programId}&year_started=${currentCourseType}`
        );

        const courseData = response.data;
        console.log("API Response Data course:", courseData);

        // Assuming courseData is an array of course_reco objects
        setCurriculumData(courseData);

        // Now you can use the curriculumStore to get course_code and course_title
        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [strand, programId, studentNumber]);

  // Update matchedCourses when curriculumData changes
  useEffect(() => {
    // Extracting course codes from evaluationData
    const evaluationCourseCodes = evaluationData.map(
      (course) => course.course_reco
    );

    // Log values for debugging
    console.log("Evaluation Course Codes:", evaluationCourseCodes);
    console.log("Curriculum Data:", curriculumData);

    // Filter curriculumData based on the matched course codes
    const matchedCourses = curriculumData.filter((course) => {
      const courseCodeLowerCase = course.course_code.trim();
      const included = evaluationCourseCodes.includes(courseCodeLowerCase);
      console.log(
        `Checking ${courseCodeLowerCase} against ${evaluationCourseCodes.join(
          ", "
        )}: ${included ? "Matched" : "Not Matched"}`
      );
      return included;
    });

    // You can now use matchedCourses for further processing
    console.log("Matched Courses:", matchedCourses);
    setMatchedCourses(matchedCourses);
  }, [evaluationData, curriculumData]);

  useEffect(() => {
    setStartYear(studentNumber.substring(0, 4));
  }, [studentNumber]);

  useEffect(() => {
    console.log("Curriculum Data:", curriculumData);
    console.log("Evaluation Data:", evaluationData);
    console.log("MatchedCourses Data:", matchedCourses);
  }, [evaluationData, matchedCourses, curriculumData]);

  //fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        if (studentData) {
          setStudent(studentData);
          setProgramId(studentData.program_id);
          setStrand(studentData.strand);
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);

  const getYearText = (year) => {
    switch (year) {
      case 1:
        return `${startYear}-${Number(startYear) + 1}`;
      case 2:
        return `${Number(startYear) + 1}-${Number(startYear) + 2}`;
      case 3:
        return `${Number(startYear) + 2}-${Number(startYear) + 3}`;
      case 4:
        return `${Number(startYear) + 3}-${Number(startYear) + 4}`;
      case 5:
        return `${Number(startYear) + 4}-${Number(startYear) + 5}`;
      case 6:
        return `${Number(startYear) + 5}-${Number(startYear) + 6}`;
      default:
        return "";
    }
  };

  console.log("getYearText", getYearText(year));

  // const formatDate = (dateString) => {
  //   const date = new Date(dateString);
  //   const formattedDate = date.toLocaleDateString();
  //   return formattedDate;
  // };

  const totalCredits = evaluationData.reduce((sum, evaluationItem) => {
    return sum + evaluationItem.evalcredit_unit;
  }, 0);

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
      filename: "evaluation.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    });

    if (table) {
      table.style.width = ""; // Reset to default width
    }
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

  const sumNumLectures = matchedCourses.reduce(
    (sum, course) => sum + course.num_lecture,
    0
  );

  const sumNumLab = matchedCourses.reduce(
    (sum, course) => sum + course.num_lab,
    0
  );

  const filteredCourses = {
    "First First Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "First Semester"
    ),
    "First Second Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Second First Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "First Semester"
    ),
    "Second Second Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third First Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "First Semester"
    ),
    "Third Second Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third Summer Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth First Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "First Semester"
    ),
    "Fourth Second Semester": matchedCourses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Second Semester"
    ),
  };
  if (
    (studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
    programId === 1 &&
    !(strand === "STEM" || strand === "ICT")
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", matchedCourses);
    filteredCourses["Bridging"] = matchedCourses.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }

  if (
    !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019"))  &&
    programId === 1 &&
    strand !== "STEM" &&
    strand !== "ICT"
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", matchedCourses);
    filteredCourses["Bridging"] = matchedCourses.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }
  console.log("Courses by year and semester:", filteredCourses);

  function formatDate(inputDate) {
    const date = new Date(inputDate);

    const month = date.getMonth() + 1; // Months are zero-indexed, so we add 1
    const day = date.getDate();
    const year = date.getFullYear() % 100; // Get the last two digits of the year

    // Combine the formatted values into the desired string format
    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
  }

  return (
    <Flex justifyContent="center">
      <VStack justifyContent="center">
        {evaluationData.length !== 0 && (
          <Button
            style={{
              backgroundColor: "#740202",
              justifyContent: "flex-end",
              marginLeft: "50rem",
              color: "white",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onClick={handleDownloadPDF}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#950303";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#740202";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Download
          </Button>
        )}

        {evaluationData.length === 0 ? (
          <Flex justifyContent="center" alignItems="center" ml="10rem">
            <Lottie
              loop
              animationData={NoEval}
              play
              options={{
                loop: true,
                autoplay: true,
                animationData: NoEval,
                rendererSettings: {
                  preserveAspectRatio: "xMidYMid meet",
                  scale: 1,
                },
              }}
              style={{ width: "100%", height: "100%" }}
            />
          </Flex>
        ) : (
          <div ref={containerRef}>
            <VStack align="flex-start">
              <HStack justify="flex-start">
                <Text fontSize="17.5px" fontWeight="semibold">
                  Student Name:
                </Text>
                <Text>
                  {capitalizeWords(student.first_name)}{" "}
                  {capitalizeWords(student.middle_name)}{" "}
                  {capitalizeWords(student.last_name)}
                </Text>
                <Text>({student.student_number})</Text>
              </HStack>
              <HStack mb="2rem">
                <Text>Recommendation for:</Text>
                <Text> {getYearText(parseInt(year))} </Text>
                <Text>{semester}</Text>
              </HStack>
            </VStack>
            {Object.entries(filteredCourses).map(([key, matchedCourses]) => (
              <React.Fragment key={key}>
                {matchedCourses.length > 0 && (
                  <>
                    <HStack>
                      <Text>Year Level :</Text>
                      <Text>
                        {key === "Bridging" ? "" : `${key.split(" ")[0]} Year`}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text>Semester :</Text>
                      <Text>
                        {key === "Bridging"
                          ? key
                          : `${key.split(" ")[1]} Semester`}
                      </Text>
                    </HStack>
                    <TableContainer
                      mb="2rem"
                      overflowX="auto"
                      overflowY="auto"
                      w="100%"
                      justifyContent="center"
                      mt="1rem"
                    >
                      <Table
                        variant="simple"
                        fontFamily="inter"
                        size="sm"
                        style={{ minWidth: "800px", maxHeight: "100%" }}
                      >
                        <Thead bg="palette.primary" h="5rem">
                          <Tr>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Course Code
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Course Title
                            </Th>
                            <Th w="1rem" color="palette.secondary">
                              Pre-Requisite(s)
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Lecture</div>
                              <div>Hours</div>
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Lab</div>
                              <div>Hours</div>
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Course</div>
                              <div>Credit</div>
                            </Th>

                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Date
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {matchedCourses.map((course) => {
                            const matchingEvaluation = evaluationData.find(
                              (evalCourse) =>
                                evalCourse.course_reco ===
                                course.course_code.trim()
                            );

                            return (
                              <Tr key={course.course_id}>
                                <Td
                                  style={{ textAlign: "center" }}
                                  fontSize="14px"
                                  fontStyle="bitter"
                                >
                                  {course.course_code}
                                </Td>
                                <Td
                                  fontSize="14px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {course.course_title}
                                </Td>
                                <Td
                                  fontSize="14px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {renderPrerequisites(course.pre_requisite)}
                                </Td>
                                <Td
                                  fontSize="14px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {course.num_lecture}
                                </Td>
                                <Td
                                  fontSize="14px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {course.num_lab}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {course.credit_unit}
                                </Td>
                                <Td style={{ textAlign: "center" }}>
                                  {matchingEvaluation
                                    ? formatDate(matchingEvaluation.date_eval)
                                    : ""}
                                </Td>
                              </Tr>
                            );
                          })}
                        </Tbody>

                        <Tfoot
                          h="2.5rem"
                          bgColor="#F0EEED"
                          colSpan="9"
                          textAlign="center"
                        >
                          <Tr>
                            <Th></Th>
                            <Th
                              fontSize="13px"
                              fontStyle="bitter"
                              style={{ textAlign: "center" }}
                            >
                              Total
                            </Th>
                            <Th></Th>
                            <Th
                              fontSize="13px"
                              fontStyle="bitter"
                              style={{ textAlign: "center" }}
                            >
                              {sumNumLectures}
                            </Th>
                            <Th
                              fontSize="13px"
                              fontStyle="bitter"
                              style={{ textAlign: "center" }}
                            >
                              {sumNumLab}
                            </Th>
                            <Th
                              fontSize="13px"
                              fontStyle="bitter"
                              style={{ textAlign: "center" }}
                            >
                              {totalCredits}
                            </Th>

                            <Th style={{ textAlign: "center" }}></Th>
                          </Tr>
                        </Tfoot>
                      </Table>
                    </TableContainer>
                  </>
                )}
              </React.Fragment>
            ))}
            <VStack
              spacing="1rem"
              mt="3rem"
              justifyContent="flex-start"
              textAlign="start"
              alignItems="flex-start"
            >
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  Faculty Name:
                </Text>
                <Text fontSize="18px">
                  {facultyData
                    ? `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
                    : ""}
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  {" "}
                  Total Credit Units:
                </Text>
                <Text fontSize="18px">{totalCreditUnits} credit unit(s)</Text>
              </HStack>
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  {" "}
                  Taken Credit Units:
                </Text>
                <Text fontSize="18px">
                  {validatedTotalUnits} credit unit(s)
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  {" "}
                  Remaining Credit Units:
                </Text>
                <Text fontSize="18px">
                  {remainingCreditUnits} credit unit(s)
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  {" "}
                  Remaining Semester(s):
                </Text>
                <Text fontSize="18px">
                  {Math.ceil(remainingCreditUnits / 23)} semester(s)
                </Text>
              </HStack>
              <HStack>
                <Text fontSize="20px" fontWeight="semibold">
                  {" "}
                  Remaining Year(s):
                </Text>
                <Text fontSize="18px">
                  {Math.ceil(Math.ceil(remainingCreditUnits / 23) / 2)} year(s)
                </Text>
              </HStack>
            </VStack>
          </div>
        )}
      </VStack>
    </Flex>
  );
}

HistoryTable.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired,
  semester: PropTypes.string.isRequired,
  totalCreditUnits: PropTypes.number.isRequired,
  validatedTotalUnits: PropTypes.number.isRequired,
  remainingCreditUnits: PropTypes.number.isRequired,
};
export default HistoryTable;
