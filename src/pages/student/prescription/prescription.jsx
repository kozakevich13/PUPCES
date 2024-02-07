import { useEffect, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import Footer from "../../../components/footer/footer";
import Navbar from "../../../components/navbar/navbar";
import breakPoints from "../../../utils/breakpoint";
import EditGrades from "../dashboard/editGrades";
import { endPoint } from "../../config";

function Prescription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [grades, setGrades] = useState([]);
  const [course, setCourse] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");


  const openModal = (courseCode) => {
    setSelectedCourseCode(courseCode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    // Fetch course data from the API
    axios
      .get(`${endPoint}/course`)
      .then((res) => {
        const courseData = res.data;
        setCourse(courseData);
      })
      .catch((err) => console.log(err));

    // Fetch grades data from the API
    axios
      .get(`${endPoint}/grades`)
      .then((res) => {
        const gradesData = res.data;
        setGrades(gradesData);
      })
      .catch((err) => console.log(err));
  }, []);

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return ""; // Return an empty string if the input is undefined
  };

  // Filter course data based on course_year and course_sem
  const filteredCourses = {
    "First First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "First Semester"
    ),
    "First Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Second First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "First Semester"
    ),
    "Second Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "First Semester"
    ),
    "Third Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third Summer Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "First Semester"
    ),
    "Fourth Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Second Semester"
    ),
  };

  // Create an array to store all courses
  const allCourses = [];

  // Loop through filtered courses and categorize them
  Object.keys(filteredCourses).forEach((key) => {
    const coursesForTable = filteredCourses[key];

    const [courseYear, courseSemester] = key.split(" ");
    // Separate courses with prerequisites and courses without prerequisites
    const coursesWithPrerequisites = [];
    const coursesWithoutPrerequisites = [];

    coursesForTable.forEach((courseItem) => {
      const courseGrades = grades.filter(
        (grade) => grade.course_code === courseItem.course_code
      );

      if (courseGrades.length === 0) {
        coursesWithoutPrerequisites.push(courseItem);
      } else {
        coursesWithPrerequisites.push(courseItem);
      }
    });

    // Concatenate the two arrays to ensure courses with prerequisites appear at the bottom
    const sortedCourses = coursesWithPrerequisites.concat(
      coursesWithoutPrerequisites
    );

    // Push sorted courses into the allCourses array
    allCourses.push({
      key,
      courseYear,
      courseSemester,
      courses: sortedCourses,
    });
  });

  return (
    <Flex
      flexDirection="column"
      minHeight="100vh"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
    >
      <Navbar />
      <VStack mt="0" mb="0" flexGrow={1} w="100%">
        <VStack mt="10rem">
          <Wrap spacing="3" w={breakPoints} mb="2rem">
            <Text mb="4rem">Subjects you needed to take:</Text>
          </Wrap>

          {allCourses.map((courseGroup) => {
            const { key, courseYear, courseSemester, courses } = courseGroup;

            // Check if there are any courses without grades
            const coursesWithoutGrades = courses.filter((courseItem) => {
              const courseGrades = grades.filter(
                (grade) => grade.course_code === courseItem.course_code
              );
              return courseGrades.length === 0;
            });

            // Render year, semester, and table header only if there are courses without grades
            if (coursesWithoutGrades.length > 0) {
              return (
                <Wrap spacing="3" w={breakPoints} key={key}>
                  <VStack spacing="1" align="flex-start">
                    <Text w="10rem" fontWeight="md" fontSize="17.5px">
                      {`${courseYear} Year `}
                    </Text>
                    <HStack spacing="40rem" justifyContent="space-between">
                      <Text w="20rem" fontWeight="md" fontSize="17.5px">
                        {`${capitalizeWords(courseSemester)} Semester `}
                      </Text>
                      <Text>2023-2024</Text>
                    </HStack>
                  </VStack>

                  <TableContainer w="100%" mt="3rem">
                    <Table variant="simple" fontFamily="inter" size="sm">
                      <Thead bg="palette.primary" paddingY="5rem" h="3rem" >
                        <Tr>
                          <Th color="palette.secondary">Course Code</Th>
                          <Th color="palette.secondary">Course Title</Th>
                          <Th color="palette.secondary">Pre-Requisite(s)</Th>
                          <Th color="palette.secondary">Course Credit</Th>
                          <Th color="palette.secondary">Grades</Th>
                          <Th color="palette.secondary">Remarks</Th>
                          <Th color="palette.secondary">Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {coursesWithoutGrades.map((courseItem) => {
                          // Find grades for the current course
                          const courseGrades = grades.filter(
                            (grade) =>
                              grade.course_code === courseItem.course_code
                          );
                          // Format grades to display with two decimal places
                          const formattedGrades = courseGrades.map((grade) =>
                            parseFloat(grade.grades).toFixed(2)
                          );
                          return (
                            <Tr key={courseItem.course_code}>
                              <Td>{courseItem.course_code}</Td>
                              <Td fontSize="13px" fontStyle="bitter">{courseItem.course_title}</Td>
                              <Td>{courseItem.pre_requisite}</Td>
                              <Td>{courseItem.credit_unit}</Td>
                              <Td>{formattedGrades.join(", ")}</Td>
                              <Td>
                                {courseGrades
                                  .map((grade) => grade.remarks)
                                  .join(", ")}
                              </Td>
                              <Td>
                                <Button
                                  transition="all .3s ease"
                                  fontSize=".8rem"
                                  bg="green.500"
                                  color="white"
                                  _hover={{ bg: "green.400" }}
                                  onClick={() => {
                                    setSelectedCourseCode(
                                      courseItem.course_code
                                    ); // Set the selected course code
                                    openModal();
                                  }}
                                >
                                  Edit
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Wrap>
              );
            } else {
              return null; // If there are no courses without grades, return null
            }
          })}
        </VStack>

        <Spacer mt="10rem" />
        <Footer />
      </VStack>
      <EditGrades
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCourseCode={selectedCourseCode}
      />
    </Flex>
  );
}

export default Prescription;

