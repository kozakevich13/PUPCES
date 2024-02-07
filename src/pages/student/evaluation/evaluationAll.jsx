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
import axios from "axios";

import html2pdf from "html2pdf.js";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { endPoint } from "../../config";

function EvaluationAll({
  studentNumber,
  totalCreditUnits,
  validatedTotalUnits,
  remainingCreditUnits,
}) {
  const [programId, setProgramId] = useState("");
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [curriculumData, setCurriculumData] = useState([]);
  const [evaluationData, setEvaluationData] = useState([]);
  const [groupedCoursesByYearSem, setGroupedCoursesByYearSem] = useState({});
  const [facultyId, setFacultyId] = useState();
  const [year1Data, setYear1Data] = useState([]);
  const [year2Data, setYear2Data] = useState([]);
  const [year3Data, setYear3Data] = useState([]);
  const [year4Data, setYear4Data] = useState([]);
  const [firstsem, setFirstSem] = useState([]);
  const [secondsem, setSecondSem] = useState([]);
  const [summersem, setSummerSem] = useState([]);
  const [facultyname, setFacultyName] = useState();
  const [curriculumMap, setCurriculumMap] = useState(new Map());
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [startYear, setStartYear] = useState();
  console.log("Student NUmber", studentNumber);

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
          setFname(studentData.first_name);
          setMname(studentData.middle_name);
          setLname(studentData.last_name);
          console.log("fname", studentData.first_name);
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);

  const getCourseType = (studentNumber) => {
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      return 2019;
    } else {
      // Handle any other cases or provide a default value
      return 2022;
    }
  };
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
        // Now you can use the curriculumStore to get course_code and course_title
        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );

        setCurriculumMap(newCurriculumMap);
        console.log("Curriculum Map:", newCurriculumMap);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [programId, studentNumber]);

  //fetch evaluate
  useEffect(() => {
    axios
      .get(`${endPoint}/evaluate-student?student_number=${studentNumber}`)
      .then((response) => {
        console.log("API Response:", response.data);

        // Filter data based on eval_year
        const year1 = response.data.filter((item) => item.eval_year === 1);
        const year2 = response.data.filter((item) => item.eval_year === 2);
        const year3 = response.data.filter((item) => item.eval_year === 3);
        const year4 = response.data.filter((item) => item.eval_year === 4);

        setYear1Data(year1);
        setYear2Data(year2);
        setYear3Data(year3);
        setYear4Data(year4);

        // Filter data based on eval_sem
        const first = response.data.filter(
          (item) => item.eval_sem === "First Semester"
        );
        const second = response.data.filter(
          (item) => item.eval_sem === "Second Semester"
        );
        const summer = response.data.filter(
          (item) => item.eval_sem === "Summer Semester"
        );

        setFirstSem(first);
        setSecondSem(second);
        setSummerSem(summer);

        const facultyId = response.data.faculty_id;
        setFacultyId(facultyId);

        // Set all data
        setEvaluationData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setEvaluationData([]);
      });
  }, [studentNumber]);

  //fetch faculty
  useEffect(() => {
    axios

      .get(`${endPoint}/faculty`)
      .then((response) => {
        const facultyData = response.data;

        // Find the faculty information based on faculty_id
        const facultyInfo = facultyData.find(
          (faculty) => faculty.id === facultyId
        );

        // Now you can use facultyInfo to get faculty details
        console.log("Faculty Information:", facultyInfo);

        // Set the faculty name in the local state
        if (facultyInfo) {
          const fullName = `${facultyInfo.faculty_fname} ${facultyInfo.faculty_mname} ${facultyInfo.faculty_lname}`;
          setFacultyName(fullName);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyId]);

  useEffect(() => {
    console.log("Curriculum Data", curriculumData);
    console.log("evaluationData", evaluationData);
    console.log("year1Data", year1Data);
    console.log("year2Data", year2Data);
    console.log("year3Data", year3Data);
    console.log(" year4Data", year4Data);
    console.log("First sem", firstsem);
    console.log("Second sem", secondsem);
    console.log("Summer sem", summersem);
  }, [
    curriculumData,
    evaluationData,
    firstsem,
    secondsem,
    summersem,
    year1Data,
    year2Data,
    year3Data,
    year4Data,
  ]);
  //startyear
  useEffect(() => {
    setStartYear(studentNumber.substring(0, 4));
  }, [studentNumber]);
  // Update matchedCourses when curriculumData changes
  useEffect(() => {
    // Extracting course codes from evaluationData
    const evaluationCourseCodes = evaluationData.map(
      (course) => course.course_reco
    );

    // Filter curriculumData based on the matched course codes
    const matchedCourses = evaluationData.map((evalCourse) => {
      const matchingCourse = curriculumData.find(
        (course) => evalCourse.course_reco === course.course_code.trim()
      );

      return {
        ...evalCourse,
        evalYear: evalCourse.eval_year,
        evalSem: evalCourse.eval_sem,
        ...matchingCourse, // Include the courseData directly
      };
    });

    // You can now use matchedCourses for further processing
    console.log("Matched Courses:", matchedCourses);
    setMatchedCourses(matchedCourses);

    // Add the grouping logic here
    const groupedCoursesByYearSem = matchedCourses.reduce((grouped, course) => {
      const evalKey = `${course.evalYear}-${course.evalSem}`;

      if (!grouped[evalKey]) {
        grouped[evalKey] = {};
      }

      const nestedKey = `${course.course_year}-${course.course_sem}`;

      if (!grouped[evalKey][nestedKey]) {
        grouped[evalKey][nestedKey] = [];
      }

      grouped[evalKey][nestedKey].push(course);
      return grouped;
    }, {});

    console.log(
      "Grouped Courses by Year and Semester:",
      groupedCoursesByYearSem
    );

    setGroupedCoursesByYearSem(groupedCoursesByYearSem);
  }, [evaluationData, curriculumData]);

  const groupedCourses = matchedCourses.reduce((grouped, course) => {
    const key = `${course.evalYear}-${course.evalSem}`;

    if (!grouped[key]) {
      grouped[key] = [];
    }

    grouped[key].push(course);
    return grouped;
  }, {});

  if (evaluationData.length === 0) {
    return <div>No evaluation data available.</div>;
  }

  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return ""; // Return an empty string if the input is undefined
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

  const mapEvalKeyToYearLevel = (evalKey) => {
    const [year, semester] = evalKey.split("-");

    switch (year) {
      case "1":
        return `${startYear}-${Number(startYear) + 1} - ${semester}`;
      case "2":
        return `${Number(startYear) + 1}-${
          Number(startYear) + 2
        } - ${semester}`;
      case "3":
        return `${Number(startYear) + 2}-${
          Number(startYear) + 3
        } - ${semester}`;
      case "4":
        return `${Number(startYear) + 3}-${
          Number(startYear) + 4
        } - ${semester}`;
      case 5:
        return `${Number(startYear) + 4}-${
          Number(startYear) + 5
        } - ${semester}`;
      case 6:
        return `${Number(startYear) + 5}-${
          Number(startYear) + 6
        } - ${semester}`;

      default:
        return "";
    }
  };

  const mapYearToYearLevel = (year) => {
    switch (year) {
      case 1:
        return "First Year";
      case 2:
        return "Second Year";
      case 3:
        return `Third Year`;
      case 4:
        return `Fourth Year`;

      default:
        return "";
    }
  };

  const calculateSchoolYear = (evalKey) => {
    const [year, semester] = evalKey.split("-");
    let schoolYearStart = parseInt(studentNumber.substring(0, 4));
    let schoolYearEnd = schoolYearStart;

    switch (year) {
      case "1":
        schoolYearEnd += 1;
        break;
      case "2":
        schoolYearStart += 1;
        schoolYearEnd += 2;
        break;
      case "3":
        schoolYearStart += 2;
        schoolYearEnd += 3;
        break;
      case "4":
        schoolYearStart += 3;
        schoolYearEnd += 4;
        break;
      default:
        schoolYearEnd = schoolYearStart + 5;
        break;
    }

    return `${schoolYearStart}-${schoolYearEnd}`;
  };

  return (
    <Flex justifyContent="center" padding=" 0 5rem">
      <VStack justifyContent="center">
        <Button
          style={{
            backgroundColor: "#740202",
            justifyContent: "flex-end",
            marginLeft: "50rem",
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
        <div ref={containerRef}>
          <VStack align="flex-start">
            <HStack justify="flex-start">
              <Text fontSize="17.5px" fontWeight="semibold">
                Student Name:
              </Text>
              <Text>
                {capitalizeWords(fname)} {capitalizeWords(mname)}{" "}
                {capitalizeWords(lname)}
              </Text>
            </HStack>
          </VStack>

          {Object.entries(groupedCoursesByYearSem).map(
            ([evalKey, nestedGroups]) => (
              <div key={evalKey}>
                <HStack mt="2rem">
                  <Text fontSize="20px" fontWeight="semibold">
                    Recommendation for:
                  </Text>
                  <Text fontSize="20px" fontWeight="semibold">
                    {mapEvalKeyToYearLevel(evalKey)}
                  </Text>
                </HStack>

                {Object.entries(nestedGroups).map(([nestedKey, courses]) => (
                  <div key={nestedKey}>
                    <HStack mt="3rem">
                      <Text fontSize="17.5px" fontWeight="semibold">
                        Year Level :
                      </Text>
                      <Text w="10rem" fontWeight="md" fontSize="17.5px">
                        {mapYearToYearLevel(courses[0].course_year)}
                      </Text>
                    </HStack>

                    <HStack spacing="28rem" justifyContent="space-between">
                      <HStack>
                        <Text fontSize="17.5px" fontWeight="semibold">
                          Semester :
                        </Text>
                        <Text>{courses[0].course_sem}</Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="17.5px" fontWeight="semibold">
                          School Year:{" "}
                        </Text>
                        <Text>{calculateSchoolYear(evalKey)}</Text>
                      </HStack>
                    </HStack>

                    {Object.entries(
                      courses.reduce((grouped, course) => {
                        const key = `${course.course_year}-${course.course_sem}`;

                        if (!grouped[key]) {
                          grouped[key] = [];
                        }

                        grouped[key].push(course);
                        return grouped;
                      }, {})
                    ).map(([courseKey, groupedCourses]) => (
                      <div key={courseKey}>
                        {/* <Text mt="1rem" fontSize="16px" fontWeight="semibold">
                        {`Courses for ${courseKey}`}
                      </Text> */}
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
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Prerequisite{" "}
                                </Th>
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Credit Units
                                </Th>
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Lecture Hours
                                </Th>
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Lab Hours
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
                              {groupedCourses.map((course) => (
                                <Tr key={course.evaluate_id}>
                                  <Td fontSize="14px" fontStyle="bitter">
                                    {course.course_reco}
                                  </Td>
                                  <Td
                                    className="course-title-cell"
                                    fontSize="14px"
                                    fontStyle="bitter"
                                  >
                                    {course.course_title}
                                  </Td>
                                  <Td
                                    fontSize="14px"
                                    fontStyle="bitter"
                                    style={{
                                      textAlign: "center",
                                      lineHeight: "1.4",
                                    }}
                                  >
                                    {renderPrerequisites(course.pre_requisite)}
                                  </Td>

                                  <Td
                                    fontSize="14px"
                                    fontStyle="bitter"
                                    style={{ textAlign: "center" }}
                                  >
                                    {course.credit_unit}
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
                                  <Td>
                                    {new Date(
                                      course.date_eval
                                    ).toLocaleDateString()}
                                  </Td>
                                </Tr>
                              ))}
                            </Tbody>
                            <Tfoot
                              h="2.5rem"
                              bgColor="#F0EEED"
                              colSpan="5"
                              textAlign="center"
                            >
                              <Tr>
                                <Th></Th>
                                <Th>Total:</Th>
                                <Th></Th>
                                <Th style={{ textAlign: "center" }}>
                                  {groupedCourses.reduce((sum, course) => {
                                    console.log(
                                      "Credit Unit:",
                                      course.credit_unit
                                    );
                                    return sum + course.credit_unit;
                                  }, 0)}
                                </Th>
                                <Th style={{ textAlign: "center" }}>
                                  {groupedCourses.reduce(
                                    (sum, course) => sum + course.num_lecture,
                                    0
                                  )}
                                </Th>
                                <Th style={{ textAlign: "center" }}>
                                  {groupedCourses.reduce(
                                    (sum, course) => sum + course.num_lab,
                                    0
                                  )}
                                </Th>
                                <Th></Th>
                              </Tr>
                            </Tfoot>
                          </Table>
                        </TableContainer>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          )}
          <VStack
            mr="35rem"
            spacing="1rem"
            mt="3rem"
            justifyContent="flex-start"
            textAlign="start"
            alignItems="flex-start"
          >
            <HStack>
              <Text fontWeight="bold" fontSize="18px">
                Evaluated by:
              </Text>
              <Text ml="3rem" fontWeight="semibold" fontSize="20px">
                {facultyname}
              </Text>
            </HStack>

            <HStack mt="2rem">
              <Text fontWeight="bold" fontSize="18px">
                {" "}
                Total Credit Units:
              </Text>
              <Text ml="4rem" fontWeight="semibold" fontSize="18px">
                {totalCreditUnits} units(s)
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" fontSize="18px">
                Taken Credit Units:
              </Text>
              <Text ml="3.4rem" fontWeight="semibold" fontSize="18px">
                {validatedTotalUnits} unit(s)
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" fontSize="18px">
                Remaining Credit Units:
              </Text>
              <Text ml="1rem" fontWeight="semibold" fontSize="18px">
                {remainingCreditUnits} unit(s)
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" fontSize="18px">
                Remaining Semester(s):
              </Text>
              <Text ml="1rem" fontWeight="semibold" fontSize="18px">
                {" "}
                {Math.ceil(remainingCreditUnits / 23)} semester(s)
              </Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold" fontSize="18px">
                Remaining Year(s):
              </Text>
              <Text ml="3.5rem" fontWeight="semibold" fontSize="18px">
                {" "}
                {Math.ceil(Math.ceil(remainingCreditUnits / 23) / 2)} year(s)
              </Text>
            </HStack>
          </VStack>
        </div>
      </VStack>
    </Flex>
  );
}

EvaluationAll.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  totalCreditUnits: PropTypes.number.isRequired,
  validatedTotalUnits: PropTypes.number.isRequired,
  remainingCreditUnits: PropTypes.number.isRequired,
};

export default EvaluationAll;
