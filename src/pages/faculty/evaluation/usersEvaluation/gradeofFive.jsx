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
  Tr,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

function GradeofFive({ filterCourses, studentNumber }) {
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);

  useEffect(() => {
    
    const includedCourses = filterCourses();
    console.log("Included Courses:", includedCourses);

 
    console.log("Student Number:", studentNumber);
  }, [filterCourses, studentNumber]);

  useEffect(() => {
    // Fetch grades based on the studentNumber
    const fetchGrades = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/grades?studentNumber=${studentNumber}`
        );
        console.log("Grades API Response:", response.data);
        setGrades(response.data); 
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    fetchGrades();
  }, [studentNumber]);

  useEffect(() => {
   
    const filteredCourses = filterCourses();
    console.log("Filtered Courses:", filteredCourses);

    // Filter the courses based on grades
    const coursesWithFilteredGrades = filteredCourses.reduce(
      (accumulator, course) => {
        const courseGrades = grades.filter(
          (grade) => grade.course_id === course.course_id
        );

        // Check if the course has grades and filter the unwanted grades
        if (courseGrades.length > 0) {
          const filteredGrades = courseGrades.filter((grade) =>
            [5, 0, -1].includes(grade.grades)
          );

          if (filteredGrades.length > 0) {
            accumulator.push({
              ...course,
              grades: filteredGrades,
            });
          }
        }

        return accumulator;
      },
      []
    );

    console.log("Courses with Filtered Grades:", coursesWithFilteredGrades);

    // Set the filtered courses in the local state
    setFilteredGrades(coursesWithFilteredGrades);
  }, [filterCourses, grades, studentNumber]);

  const renderPrerequisites = (prerequisites) => {
    if (!prerequisites) return null;

    const prerequisiteList = prerequisites.split(",");

    return (
      <>
        {prerequisiteList.map((prerequisite, index) => (
          <div key={index}>{prerequisite.trim()}</div>
        ))}
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
        return ""; 
    }
  };
  if (filteredGrades.length === 0) {
    return null; 
  }
  return (
    <Flex mt="7rem">
      <VStack>
        <HStack justify="flex-start">
          <Text mr="40rem" textAlign="flex-start" fontWeight="semibold">
            Course(s) with `Fail` Remarks and needed to take:
          </Text>
        </HStack>
        <TableContainer overflowX="auto" w="100%" >
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
                  Grade
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  <div>Year</div>
                  <div>Level</div>
                </Th>
                <Th style={{ textAlign: "center" }} color="palette.secondary">
                  <div>Semester</div>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredGrades.map((course) => (
                <Tr key={course.course_id}>
                  <Td>{course.course_code}</Td>
                  <Td>{course.course_title}</Td>
                  <Td> {renderPrerequisites(course.pre_requisite)}</Td>
                  <Td>{course.credit_unit}</Td>
                  <Td>
                    {course.grades[0].grades === -1
                      ? "Incomplete"
                      : course.grades[0].grades === 0
                      ? "Withdraw"
                      : course.grades[0].grades}
                  </Td>
                  <Td>{`${getYearText(
                    parseInt(course.course_year)
                  )} Year `}</Td>
                  <Td>{course.course_sem}</Td>
                </Tr>
              ))}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th></Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </VStack>
    </Flex>
  );
}

GradeofFive.propTypes = {
  filterCourses: PropTypes.func.isRequired,
  studentNumber: PropTypes.string.isRequired,
};

export default GradeofFive;
