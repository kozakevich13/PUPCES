import {
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
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

function Notice({ filterExcludedCourses, year, semester, studentNumber }) {
  console.log("Notice", filterExcludedCourses);
  console.log("year:", year);
  console.log("semester:", semester);
  const [programId, setProgramId] = useState();
  const [strand, setStrand] = useState();
  const [curriculumMap, setCurriculumMap] = useState(new Map());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        setProgramId(studentData.program_id);

        setStrand(studentData.strand);
        console.log("Student data:", studentData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);

  useEffect(() => {
    console.log("Strand and ProgramID", strand, programId);
  }, [strand, programId]);

  const getCourseType = (strand, programId, studentNumber) => {
    if (
      (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) &&
      programId === 1 &&
      (strand === "STEM" || strand === "ICT")
    ) {
      return "Old";
    } else if (
      (studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019"))  &&
      programId === 1 &&
      !(strand === "STEM" || strand === "ICT")
    ) {
      return "Old";
    } else if (
      !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 1 &&
      strand !== "STEM" &&
      strand !== "ICT"
    ) {
      return "New";
    } else if (
      !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 1 &&
      (strand === "STEM" || strand === "ICT")
    ) {
      return "New";
    } else if (
      (studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 2
    ) {
      return "Old";
    } else if (
      !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 2
    ) {
      return "New";
    } else if (
      (studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 3
    ) {
      return "Old";
    } else if (
      !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021") || studentNumber.startsWith("2019")) &&
      programId === 3
    ) {
      return "New";
    } else {
      // Handle any other cases or provide a default value
      return "Unknown";
    }
  };
  //fetch curriculum
  useEffect(() => {
    const currentCourseType = getCourseType(strand, programId, studentNumber);
    console.log(currentCourseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&course_type=${currentCourseType}`
      )
      .then((res) => {
        const curriculumStore = res.data;
        console.log("Curriculum Store:", curriculumStore);

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

  const filteredCourses = filterExcludedCourses(year, semester);
  console.log("filteredCourses in Notice:", filteredCourses);
  console.log(curriculumMap);
  
  const isMatchingCourse = (course) => {
    const targetYear = typeof year === "string" ? parseInt(year, 10) : year;

    const isMatchingYear = course.course_year === targetYear;
    const isMatchingSemester = course.course_sem === semester;
    const hasPrerequisites =
      course.pre_requisite && course.pre_requisite.trim() !== "";

    console.log(
      `Course: ${course.course_code}, Year: ${
        course.course_year
      } (${typeof course.course_year}), Semester: ${
        course.course_sem
      } (${typeof course.course_sem}), MatchingYear: ${isMatchingYear}, MatchingSemester: ${isMatchingSemester}, HasPrerequisites: ${hasPrerequisites}`
    );

    return isMatchingYear && isMatchingSemester && hasPrerequisites;
  };

  if (filteredCourses.filter(isMatchingCourse).length === 0) {
    return null;
  }
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

  const getYearText = (numericYear) => {
    switch (numericYear) {
      case 1:
        return "First";
      case 2:
        return "Second";
      case 3:
        return "Third";
      case 4:
        return "Fourth";
      default:
        return ""; // You can adjust this based on your needs
    }
  };
  const totalCreditUnit = filteredCourses
    .filter(isMatchingCourse)
    .reduce((total, course) => total + course.credit_unit, 0);

  const totalNumLecture = filteredCourses
    .filter(isMatchingCourse)
    .reduce((total, course) => total + course.num_lecture, 0);

  const totalNumLab = filteredCourses
    .filter(isMatchingCourse)
    .reduce((total, course) => total + course.num_lab, 0);

  return (
    <Flex mt="6rem" flexDirection="column" w="100%">
      <VStack>
        <HStack justify="flex-start">
          <Text mr="30rem" textAlign="flex-start" fontWeight="semibold">
            Course(s) in {`${getYearText(parseInt(year))} Year `} {semester}{" "}
            that needs to take the pre requisite first:{" "}
          </Text>
        </HStack>
        <TableContainer overflowX="auto" w="100%">
          <Table
            variant="simple"
            fontFamily="inter"
            size="sm"
            style={{ minWidth: "800px" }}
          >
            <Thead bg="palette.primary" h="5rem">
              <Tr>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  Course Code
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  Course Title
                </Th>
                <Th w="1rem" color="palette.secondary">
                  Pre-Requisite(s)
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  <div>Course</div>
                  <div>Credit</div>
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  <div>Lecture</div>
                  <div>Hours</div>
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  <div>Lab</div>
                  <div>Hours</div>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCourses.filter(isMatchingCourse).map((course) => (
                <Tr key={course.course_id}>
                  <Td>{course.course_code}</Td>
                  <Td>{course.course_title}</Td>

                  <Td> {renderPrerequisites(course.pre_requisite)}</Td>
                  <Td>{course.credit_unit}</Td>
                  <Td>{course.num_lecture}</Td>
                  <Td>{course.num_lab}</Td>
                </Tr>
              ))}
            </Tbody>

            <Tfoot h="2.5rem" bgColor="#F0EEED" colSpan="9" textAlign="center">
              <Tr>
                <Th></Th>
                <Th>Total</Th>
                <Th></Th>
                <Th>{totalCreditUnit}</Th>
                <Th>{totalNumLecture}</Th>
                <Th>{totalNumLab}</Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </VStack>
    </Flex>
  );
}

Notice.propTypes = {
  filterExcludedCourses: PropTypes.func.isRequired,
  year: PropTypes.number.isRequired,
  semester: PropTypes.string.isRequired,
  studentNumber: PropTypes.string.isRequired,
};

export default Notice;
