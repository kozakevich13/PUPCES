import {
  HStack,
  Select,
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
  Flex,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

function Overstay({ studentNumber }) {
  const [stayingYear, setStayingYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const [programs, setPrograms] = useState([]);
  const [programId, setProgramId] = useState("");
  const [strand, setStrand] = useState("");
  const [programAbbr, setProgramAbbr] = useState();

  const [curriculumData, setCurriculumData] = useState([]);
  const [gradesData, setGradesData] = useState([]);
  const [status, setStatus] = useState("");
  const [combinedAndGroupedData, setCombinedAndGroupedData] = useState({});
  const [courseIdWithoutGrades, setCourseIdWithoutGrades] = useState([]);
  const startingYear = studentNumber ? studentNumber.substring(0, 4) : null;
  const [graduationMessage, setGraduationMessage] = useState("");
  const [
    coursesWithoutGradesFromPreviousYear,
    setCoursesWithoutGradesFromPreviousYear,
  ] = useState([]);
  const [courseCodeWithoutGrades, setCourseCodeWithoutGrades] = useState([]);
  const [semester, setSemester] = useState("");
  const [year, setYear] = useState();
  const [curriculumMap, setCurriculumMap] = useState(new Map());

  // fetch program
  useEffect(() => {
    const fetchProgram = async () => {
      try {
        const response = await fetch(`${endPoint}/programs`);
        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
          console.log("Program data:", data);
        } else {
          console.error("Failed to fetch program data");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgram();
  }, []);

  //fetch student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        setProgramId(studentData.program_id);
        setStatus(studentData.status);
        setStrand(studentData.strand);
        console.log("Student data:", studentData);

        const program = programs.find(
          (p) => p.program_id === studentData.program_id
        );
        if (program) {
          setProgramAbbr(program.program_abbr);
          console.log("Program abbreviation:", program.program_abbr);

          // Determine staying years based on the first letter of programAbbr
          if (program.program_abbr.charAt(0).toUpperCase() === "B") {
            setStayingYear(6);
          } else if (program.program_abbr.charAt(0).toUpperCase() === "D") {
            setStayingYear(4);
          } else {
            console.error("Unable to determine staying years");
          }
        } else {
          console.error("Program abbreviation not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [programs, studentNumber]);

  useEffect(() => {
    console.log("Starting Year:", startingYear);
    console.log("Staying Year:", stayingYear);

    // Convert startingYear and stayingYear to numbers and then add them
    const calculatedEndYear = Number(startingYear) + Number(stayingYear);

    // Set the calculatedEndYear in the state
    setEndYear(calculatedEndYear);

    console.log("End Year:", calculatedEndYear);
  }, [startingYear, stayingYear, setEndYear]);

  const getCourseType = (studentNumber) => {
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      return 2019;
    } else {
      return 2022;
    }
  };

  //fetch curriculum
  useEffect(() => {
    const currentCourseType = getCourseType(studentNumber);
    console.log(currentCourseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${currentCourseType}`
      )
      .then((res) => {
        const curriculumStore = res.data;
        // Assuming your curriculum API response has a 'data' field containing the curriculum data
        setCurriculumData(res.data);
        console.log("Curriculum Data:", res.data);

        // Now you can use the curriculumStore to get course_code and course_title
        const newCurriculumMap = new Map(
          curriculumStore.map((course) => [
            course.course_code,
            course.course_title,
          ])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);
      })
      .catch((error) => {
        console.error("Error fetching curriculum data:", error);
      });
  }, [strand, programId, studentNumber]);

  //fetch grade
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/grades?studentNumber=${studentNumber}`
        );

        // Assuming your grades API response has a 'data' field containing the grades data
        setGradesData(response.data);
        console.log("Grades Data:", response.data);
      } catch (error) {
        console.error("Error fetching grades data:", error);
      }
    };

    fetchGrades();
  }, [studentNumber]);

  // Group curriculum data by course_year and course_sem
  const groupedCurriculum = curriculumData.reduce((acc, curriculum) => {
    const { course_year, course_sem } = curriculum;
    const key = `${course_year}-${course_sem}`;
    acc[key] = [...(acc[key] || []), curriculum];
    return acc;
  }, {});

  // Group grades data by course_year and course_sem
  const groupedGrades = gradesData.reduce((acc, grade) => {
    const { course_year, course_sem } = grade;
    const key = `${course_year}-${course_sem}`;
    acc[key] = [...(acc[key] || []), grade];
    return acc;
  }, {});

  useEffect(() => {
    console.log("Grouped Curriculum Data:", groupedCurriculum);
    console.log("Grouped Grades Data:", groupedGrades);
  }, [groupedCurriculum, groupedGrades]);

  useEffect(() => {
    const combinedData = curriculumData.map((curriculumItem) => {
      const correspondingGrade = gradesData.find(
        (gradeItem) => gradeItem.course_id === curriculumItem.course_id
      );
      return { ...curriculumItem, ...correspondingGrade };
    });

    setCombinedAndGroupedData(groupByCourseYearAndSem(combinedData));
  }, [curriculumData, gradesData]);

  useEffect(() => {
    console.log("Combined and Grouped Data:", combinedAndGroupedData);
  }, [combinedAndGroupedData]);

  const groupByCourseYearAndSem = (data) => {
    return data.reduce((acc, item) => {
      const { course_year, course_sem } = item;
      const key = `${course_year}-${course_sem}`;
      acc[key] = [...(acc[key] || []), item];
      return acc;
    }, {});
  };

  useEffect(() => {
    const getCourseIdWithoutGrades = () => {
      const allCourseIds = curriculumData.map(
        (curriculumItem) => curriculumItem.course_id
      );
      const courseIdsWithGrades = gradesData.map(
        (gradeItem) => gradeItem.course_id
      );

      // Include courses with grades equal to 5, 0, or -1
      const specialGrades = [5, 0, -1];
      const specialCourseIds = gradesData
        .filter((gradeItem) => specialGrades.includes(gradeItem.grades))
        .map((gradeItem) => gradeItem.course_id);

      const courseIdsWithoutGrades = allCourseIds.filter(
        (courseId) =>
          !courseIdsWithGrades.includes(courseId) ||
          specialCourseIds.includes(courseId)
      );

      setCourseIdWithoutGrades(courseIdsWithoutGrades);
    };

    getCourseIdWithoutGrades();
  }, [curriculumData, gradesData]);

  const matchAndGroupData = () => {
    const matchedData = curriculumData.filter((curriculumItem) =>
      courseIdWithoutGrades.includes(curriculumItem.course_id)
    );

    // Use a Set to store unique courses
    const uniqueCourses = new Set(
      matchedData.map((course) => course.course_id)
    );

    // Create a filtered list of unique courses
    const uniqueCoursesData = curriculumData.filter((course) =>
      uniqueCourses.has(course.course_id)
    );

    // Group the unique courses data by course_year and course_sem
    const groupedData = groupByCourseYearAndSem(uniqueCoursesData);

    // Log matched and grouped data for debugging
    console.log(
      "Matched and Grouped Data that do not have grades:",
      groupedData
    );

    // Additional logging for courses without grades
    const coursesWithoutGrades = uniqueCoursesData.filter(
      (item) => !item.has_grades
    );
    console.log(`Courses without grades:`, coursesWithoutGrades);
    setCourseCodeWithoutGrades(coursesWithoutGrades);
  };

  console.log("Course code Without grades", courseCodeWithoutGrades);

  const determineCourseYear = (startingYear, endYear) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month, so add 1

    if (currentMonth >= 10) {
      // If the current month is October or later, the academic year has progressed, add 1 to the startingYear
      return currentYear - (startingYear + 1) + 1;
    } else {
      // If the current month is before October, the academic year has not progressed, use the original range
      return currentYear - startingYear;
    }
  };

  // Log the determined course year
  const currentCourseYear = determineCourseYear(Number(startingYear), endYear);
  console.log("Current Course Year (outside useEffect):", currentCourseYear);

  // Use the determined course year in your component
  useEffect(() => {
    console.log("Current Course Year (inside useEffect):", currentCourseYear);
  }, [currentCourseYear]);

  const getCurrentSemester = () => {
    const currentMonth = new Date().getMonth() + 1; // getMonth() returns 0-based month, so add 1

    // Assuming May is the transition month for the second semester
    if (currentMonth >= 5 && currentMonth < 10) {
      return "Second Semester";
    } else {
      return "First Semester";
    }
  };

  // Log the determined current semester
  const currentSemester = getCurrentSemester();
  console.log("Current Semester:", currentSemester);

  //...........
  const checkCoursesWithoutGrades = () => {
    const currentCourseYear = determineCourseYear(
      Number(startingYear),
      endYear
    );

    // Get all course years from courseCodeWithoutGrades state
    const allCourseYears = courseCodeWithoutGrades.map(
      (course) => course.course_year
    );
    const otherCourseYears = allCourseYears.filter(
      (year) => year !== currentCourseYear
    );

    // Get courses without grades for all other years and semesters
    const coursesWithoutGradesFromOtherYears = otherCourseYears.flatMap(
      (year) => {
        return (
          courseCodeWithoutGrades.filter(
            (course) => course.course_year === year && !course.has_grades
          ) || []
        );
      }
    );

    setCoursesWithoutGradesFromPreviousYear(courseCodeWithoutGrades);
    console.log(
      "coursesWithoutGradesFromOtherYears",
      coursesWithoutGradesFromOtherYears
    );

    const currentSemester = getCurrentSemester();
    const currentMonth = new Date().getMonth() + 1;
    console.log("current Month", currentMonth);
    console.log("currentCourseYear", currentCourseYear);

    if (currentCourseYear >= 1 && currentCourseYear <= 3) {
      setGraduationMessage(
        `You are estimated to  graduate on ${endYear - 2} - ${endYear - 1}`
      );
    } else if (
      currentCourseYear === 4 &&
      currentSemester === "Second Semester" &&
      courseDetailsTable.some((course) => course.courseSem === "First Semester")
    ) {
      setGraduationMessage(
        `You are estimated to graduate on A.Y. ${endYear - 2} -${
          endYear - 1
        } midyear`
      );
    } else if (
      currentCourseYear === 5 &&
      currentSemester === "Second Semester"
    ) {
      setGraduationMessage(`You will graduate on 2024-2025, endyear`);
    } else if (
      currentCourseYear === 6 &&
      currentMonth === 7 && // July // End of second sem
      courseDetailsTable.length > 0
    ) {
      setGraduationMessage(
        `You still have remaining courses for the first semester, but due to unfortunate circumstances, we advise you to transfer to another university to finish your university journey. Keep going forward!`
      );
    } else if (
      currentCourseYear === 6 &&
      courseDetailsTable.some(
        (course) => course.courseSem === "Second Semester"
      )
    ) {
      setGraduationMessage(
        `You still have the remaining courses for the Second Semester, due to the circumstances you will graduate on a mid-year of A.Y.${
          endYear - 1
        }- ${endYear + 2}` // 2025//2026
      );
    } else if (
      currentCourseYear === 6 &&
      courseDetailsTable.some((course) => course.courseSem === "First Semester")
    ) {
      setGraduationMessage(
        `You still have the remaining courses for the First Semester, due to the circumstances you will graduate on a mid-year of A.Y.${
          endYear + 1
        }- ${endYear + 2}`
      );
    } else if (currentCourseYear === 6 && courseDetailsTable.length > 0) {
      setGraduationMessage(
        `You still have remaining courses, due to the unfortunate circumstances we advise you to transfer to another university to finish your university journey. Keep moving forward!`
      );
    } else if (
      currentCourseYear === 6 &&
      courseDetailsTable.some(
        (course) => course.courseSem === "Summer Semester"
      )
    ) {
      setGraduationMessage(
        `You still have remaining courses for the summer semester due to this unfortunate circumstances, we advise you to transfer to other university to finish your University journey. Keep moving forward!`
      );
    } else if (
      currentCourseYear === 5 &&
      courseDetailsTable.some(
        (course) => course.courseSem === "Summer Semester"
      )
    ) {
      setGraduationMessage(
        `You still have remaining courses for the summer semester due to the circumstances you will graduate midyear on A.Y. ${
          endYear + 1
        } - ${endYear + 2}.`
      );
    }
  };

  // Use the determined course year in your component
  useEffect(() => {
    console.log("Current Course Year (inside useEffect):", currentCourseYear);

    if (curriculumData.length > 0) {
      matchAndGroupData();
      checkCoursesWithoutGrades();
    }
  }, [
    currentCourseYear,
    curriculumData,
    courseIdWithoutGrades,
    startingYear,
    endYear,
  ]);

  const courseDetailsTable = coursesWithoutGradesFromPreviousYear
    .filter((course) => course.course_year !== currentCourseYear)
    .map((course) => ({
      courseCode: course.course_code,
      courseTitle: course.course_title,
      pre_requisite: course.pre_requisite,
      creditUnits: course.credit_unit,
      courseYear: course.course_year,
      courseSem: course.course_sem,
    }));
  console.log("Filtered Course Details Table:", courseDetailsTable);

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

  const filteredCourses = courseDetailsTable.filter((course) => {
    if (year === "All Year" && semester === "All Semester") {
      // Show all courses when both "All Year" and "All Semester" are selected
      return true;
    } else if (year === "All Year") {
      // Show courses based on selected semester when "All Year" is selected
      return course.courseSem === semester;
    } else if (semester === "All Semester") {
      // Show courses based on selected year when "All Semester" is selected
      return course.courseYear === Number(year);
    } else if (year && semester) {
      // Show courses based on both selected year and semester
      return (
        course.courseYear === Number(year) && course.courseSem === semester
      );
    } else if (year) {
      // Show courses based on selected year when only year is selected
      return course.courseYear === Number(year);
    } else if (semester) {
      // Show courses based on selected semester when only semester is selected
      return course.courseSem === semester;
    }
  });

  console.log("Filtered Courses:", filteredCourses);
  const isYearSemesterSelected = year || semester;

  const calculateTotalCreditUnits = (courses) => {
    return courses.reduce((total, course) => total + course.creditUnits, 0);
  };

  return (
    <VStack mt="5rem" w="100%">
      <VStack>
        <HStack>
          <Select
            w="25rem"
            color="gray.500"
            width={{ base: "8rem", md: "9rem", lg: "10rem" }}
            placeholder="Semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <option value="First Semester">First Semester</option>
            <option value="Second Semester">Second Semester</option>
            <option value="Summer Semester">Summer Semester</option>
            <option value="Bridging">Bridging</option>
            <option value="All Semester">All Semester</option>
          </Select>
          <Select
            width={{ base: "8rem", md: "9rem", lg: "10rem" }}
            color="gray.500"
            placeholder="Year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="All Year">All Year</option>
          </Select>
        </HStack>
        {coursesWithoutGradesFromPreviousYear &&
          coursesWithoutGradesFromPreviousYear.length > 0 && (
            <Flex w="72vw" overflow="visible">
              <VStack w="95%" ml="0.5rem">
                <TableContainer w="90%" mt="1rem">
                  <Table
                    variant="simple"
                    fontFamily="inter"
                    size="sm"
                    overflowX="auto"
                  >
                    <Thead bg="palette.primary" h="5rem">
                      <Tr overflowX="auto" width="200px">
                        <Th
                          style={{ textAlign: "center" }}
                          color="palette.secondary"
                        >
                          <div>Course</div>
                          <div>Code</div>
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
                          Prerequisite
                        </Th>
                        <Th
                          style={{ textAlign: "center" }}
                          color="palette.secondary"
                        >
                          <div>Credit</div>
                          <div>Unit</div>
                        </Th>
                        <Th
                          style={{ textAlign: "center" }}
                          color="palette.secondary"
                        >
                          <div>Course</div>
                          <div>Year</div>
                        </Th>
                        <Th
                          style={{ textAlign: "center" }}
                          color="palette.secondary"
                        >
                          <div>Course</div>
                          <div>Semester</div>
                        </Th>
                      </Tr>
                    </Thead>
                    {isYearSemesterSelected ? (
                      <Tbody>
                        {filteredCourses.map((course) => (
                          <Tr key={course.courseCode}>
                            <Td>{course.courseCode}</Td>
                            <Td fontSize={{ base: "10px", md: "12px" }}>
                              {course.courseTitle}
                            </Td>
                            <Td>
                              {" "}
                              {renderPrerequisites(course.pre_requisite)}
                            </Td>
                            <Td>{course.creditUnits}</Td>
                            <Td>
                              {course.courseYear === 0 ? "" : course.courseYear}
                            </Td>
                            <Td fontSize={{ base: "8px", md: "10px" }}>
                              {course.courseSem}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    ) : (
                      <Text>Please select Year and Semester</Text>
                    )}
                    <Tfoot
                      h="2rem"
                      bgColor="#F0EEED"
                      colSpan="9"
                      textAlign="center"
                    >
                      <Tr>
                        <Th></Th>
                        <Th></Th>
                        <Th></Th>
                        <Th>{calculateTotalCreditUnits(filteredCourses)}</Th>
                        <Th></Th>
                        <Th></Th>
                      </Tr>
                    </Tfoot>
                  </Table>
                </TableContainer>
              </VStack>
            </Flex>
          )}
      </VStack>
    </VStack>
  );
}

Overstay.propTypes = {
  studentNumber: PropTypes.string.isRequired,
};

export default Overstay;
