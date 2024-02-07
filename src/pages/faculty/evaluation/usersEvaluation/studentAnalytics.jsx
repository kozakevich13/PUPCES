import {
  Box,
  Button,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { IoReturnUpBack } from "react-icons/io5";

import CreditUnits from "../../../student/dashboard/analysis/creditUnits";
import GradesAverageLine from "../../../student/dashboard/analysis/gradesAverageLine";
import GradesperSemester from "../../../student/dashboard/analysis/gradesperSemester";
import History from "../recommendationHistory/history";
import UsersEvaluation from "./usersEvaluation";
import { endPoint } from "../../../config";

import Overstay from "../../../student/dashboard/analysis/Overstay";
function StudentAnalytics({ studentNumber, evalSemValue, evalYearValue }) {
  console.log(evalSemValue, evalYearValue);
  console.log(studentNumber);
  const [student, setStudent] = useState({});
  const [status, setStatus] = useState("");
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [remainingCreditUnits, setRemainingCreditUnits] = useState(0);
  const [validatedTotalUnits, setValidatedTotalUnits] = useState(0);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [firstYearFirstSemAverage, setFirstYearFirstSemAverage] = useState(0);
  const [firstYearSecondSemAverage, setFirstYearSecondSemAverage] = useState(0);
  const [SecondYearFirstSemAverage, setSecondYearFirstSemAverage] = useState(0);
  const [SecondYearSecondSemAverage, setSecondYearSecondSemAverage] =
    useState(0);
  const [ThirdYearFirstSemAverage, setThirdYearFirstSemAverage] = useState(0);
  const [ThirdYearSecondSemAverage, setThirdYearSecondSemAverage] = useState(0);
  const [FourthYearFirstSemAverage, setFourthYearFirstSemAverage] = useState(0);
  const [FourthYearSecondSemAverage, setFourthYearSecondSemAverage] =
    useState(0);
  const [latestGradeInfo, setLatestGradeInfo] = useState(null);

  const [gradesData, setGradesData] = useState({
    firstYearFirstSemAverage: 0,
    firstYearSecondSemAverage: 0,
    SecondYearFirstSemAverage: 0,
    SecondYearSecondSemAverage: 0,
    ThirdYearFirstSemAverage: 0,
    ThirdYearSecondSemAverage: 0,
    FourthYearFirstSemAverage: 0,
    FourthYearSecondSemAverage: 0,
  });

  useEffect(() => {}, [
    firstYearFirstSemAverage,
    firstYearSecondSemAverage,
    SecondYearFirstSemAverage,
    SecondYearSecondSemAverage,
    ThirdYearFirstSemAverage,
    ThirdYearSecondSemAverage,
    FourthYearFirstSemAverage,
    FourthYearSecondSemAverage,
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the function to handle total credit units change
  const handleTotalCreditUnitsChange = (totalCreditUnits) => {
    // Update state or perform any other actions
    setTotalCreditUnits(totalCreditUnits);
  };

  const handleRemainingCreditUnitsChange = (value) => {
    setRemainingCreditUnits(value);
  };

  const handleValidatedTotalUnitsChange = (value) => {
    setValidatedTotalUnits(value);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        if (studentData) {
          setStudent(studentData);
          setStatus(studentData.status);
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);
  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) =>
          word ? word.charAt(0).toUpperCase() + word.slice(1) : ""
        )
        .join(" ");
    }
    return "";
  };

  const openModal = () => {
    // Set state to open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // Set state to close the modal
    setIsModalOpen(false);
  };

  // const goBackToEvaluation = () => {
  //   // Navigate to the "/usersevaluation" route
  //   navigate("/facultyevaluation");
  // };

  const handleGradesDataChange = (data) => {
    // Log each individual average
    console.log(
      "First Year First Semester Average:",
      data.firstYearFirstSemAverage
    );
    console.log(
      "First Year Second Semester Average:",
      data.firstYearSecondSemAverage
    );
    console.log(
      "Second Year First Semester Average:",
      data.SecondYearFirstSemAverage
    );
    console.log(
      "Second Year Second Semester Average:",
      data.SecondYearSecondSemAverage
    );
    console.log(
      "Third Year First Semester Average:",
      data.ThirdYearFirstSemAverage
    );
    console.log(
      "Third Year Second Semester Average:",
      data.ThirdYearSecondSemAverage
    );
    console.log(
      "Fourth Year First Semester Average:",
      data.FourthYearFirstSemAverage
    );
    console.log(
      "Fourth Year Second Semester Average:",
      data.FourthYearSecondSemAverage
    );

    // Set state variables for each individual average
    setFirstYearFirstSemAverage(data.firstYearFirstSemAverage);
    setFirstYearSecondSemAverage(data.firstYearSecondSemAverage);
    setSecondYearFirstSemAverage(data.SecondYearFirstSemAverage);
    setSecondYearSecondSemAverage(data.SecondYearSecondSemAverage);
    setThirdYearFirstSemAverage(data.ThirdYearFirstSemAverage);
    setThirdYearSecondSemAverage(data.ThirdYearSecondSemAverage);
    setFourthYearFirstSemAverage(data.FourthYearFirstSemAverage);
    setFourthYearSecondSemAverage(data.FourthYearSecondSemAverage);

    // Ensure the property names match the ones used in GradesperSemester.jsx
    setGradesData({
      firstYearFirstSemAverage: data.firstYearFirstSemAverage,
      firstYearSecondSemAverage: data.firstYearSecondSemAverage,
      SecondYearFirstSemAverage: data.SecondYearFirstSemAverage,
      SecondYearSecondSemAverage: data.SecondYearSecondSemAverage,
      ThirdYearFirstSemAverage: data.ThirdYearFirstSemAverage,
      ThirdYearSecondSemAverage: data.ThirdYearSecondSemAverage,
      FourthYearFirstSemAverage: data.FourthYearFirstSemAverage,
      FourthYearSecondSemAverage: data.FourthYearSecondSemAverage,
    });
  };

  // Function to find the latest non-zero grade with semester and year info
  const findLatestGradeWithInfo = () => {
    const gradesWithInfo = [
      {
        grade: firstYearFirstSemAverage,
        semester: "First Semester",
        year: "First Year",
      },
      {
        grade: firstYearSecondSemAverage,
        semester: "Second Semester",
        year: "First Year",
      },
      {
        grade: SecondYearFirstSemAverage,
        semester: "First Semester",
        year: "Second Year",
      },
      {
        grade: SecondYearSecondSemAverage,
        semester: "Second Semester",
        year: "Second Year",
      },
      {
        grade: ThirdYearFirstSemAverage,
        semester: "First Semester",
        year: "Third Year",
      },
      {
        grade: ThirdYearSecondSemAverage,
        semester: "Second Semester",
        year: "Third Year",
      },
      {
        grade: FourthYearFirstSemAverage,
        semester: "First Semester",
        year: "Fourth Year",
      },
      {
        grade: FourthYearSecondSemAverage,
        semester: "Second Semester",
        year: "Fourth Year",
      },
    ];

    // Filter out grades that are zero
    const nonZeroGradesWithInfo = gradesWithInfo.filter(
      ({ grade }) => grade !== 0
    );

    // If there are non-zero grades, return the info of the latest one; otherwise, return null
    return nonZeroGradesWithInfo.length > 0
      ? nonZeroGradesWithInfo[nonZeroGradesWithInfo.length - 1]
      : null;
  };

  // Use the function to find the latest grade with semester and year info and log it
  const latestGradeWithInfo = findLatestGradeWithInfo();
  if (latestGradeWithInfo !== null) {
    console.log("Latest Non-Zero Grade Info:", latestGradeWithInfo);
  } else {
    console.log("No non-zero grades available.");
  }

  useEffect(() => {
    const latestGradeInfo = findLatestGradeWithInfo();
    setLatestGradeInfo(latestGradeInfo);
  }, [
    firstYearFirstSemAverage,
    firstYearSecondSemAverage,
    SecondYearFirstSemAverage,
    SecondYearSecondSemAverage,
    ThirdYearFirstSemAverage,
    ThirdYearSecondSemAverage,
    FourthYearFirstSemAverage,
    FourthYearSecondSemAverage,
  ]);
  useEffect(() => {
    if (Object.keys(gradesData).length !== 0) {
      console.log("Grades data changed:", gradesData);
    }
  }, [gradesData]);
  const handleView = () => {
    setShowEvaluation(true);
  };

  return (
    <div>
      {showEvaluation ? (
        <UsersEvaluation
          studentNumber={studentNumber}
          evalSemValue={evalSemValue}
          evalYearValue={evalYearValue}
        />
      ) : (
        <Flex mt="5rem">
          <Wrap flex="30">
            <IoReturnUpBack
              onClick={handleView}
              style={{ fontSize: "25px", cursor: "pointer" }}
            />
            <VStack>
              <HStack mt="2rem" gap="30rem">
                <HStack>
                  <HStack>
                    <Text
                      fontSize="19px"
                      fontWeight="semibold"
                      fontStyle="Bitter"
                      textAlign="center"
                    >
                      {capitalizeWords(student.first_name)}{" "}
                      {capitalizeWords(student.middle_name)}{" "}
                      {capitalizeWords(student.last_name)}
                    </Text>
                    <Text>({student.student_number})</Text>
                  </HStack>
                </HStack>
                <Button
                  justify="flex-end"
                  color="white"
                  bg="palette.primary"
                  onClick={openModal}
                  _hover={{
                    bg: "palette.primaryDark",
                    transition: "background-color 0.3s",
                  }}
                >
                  Recommendation History
                </Button>
              </HStack>

              <HStack mr="54.5rem" justifyContent="flex-start">
                <Text fontWeight="semibold" fontSize="19px">
                  Status:
                </Text>
                <Text fontSize="19px">{status}</Text>
              </HStack>
            </VStack>

            <Flex w="100%" justifyContent="center" mt="5rem">
              <VStack>
                <Box padding="6rem 5rem" position="relative" boxShadow="lg">
                  <Box
                    bg="#740202"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    textAlign="center"
                    padding="1rem"
                    color="white"
                  >
                    Credit Units
                  </Box>
                  <HStack spacing="3rem">
                    <Box>
                      {
                        <CreditUnits
                          studentNumber={studentNumber}
                          onRemainingCreditUnitsChange={
                            handleRemainingCreditUnitsChange
                          }
                          onValidatedTotalUnitsChange={
                            handleValidatedTotalUnitsChange
                          }
                          onTotalCreditUnitsChange={
                            handleTotalCreditUnitsChange
                          }
                        />
                      }
                    </Box>
                    <Spacer />
                    <Box
                      alignItems="center"
                      // boxShadow="md"
                      // bg="gray.100"
                      w="25rem"
                      h="12rem"
                    >
                      <VStack>
                        <Text
                          textAlign="center"
                          fontWeight="semibold"
                          fontSize="lg"
                          mb="4"
                          padding="2rem"
                        >
                          Still have {totalCreditUnits} credit units and taken{" "}
                          {validatedTotalUnits} credit unit(s) and have{" "}
                          {remainingCreditUnits} remaining credit unit(s) to
                          complete.
                        </Text>
                        <Text
                          textAlign="center"
                          fontWeight="semibold"
                          fontSize="lg"
                          mb="4"
                          padding="2rem"
                        >
                          Still have {Math.ceil(remainingCreditUnits / 23)}{" "}
                          remaining semester(s) for{"  "}
                          {Math.ceil(Math.ceil(remainingCreditUnits / 23) / 2)}
                          {"  "}
                          year(s)
                        </Text>
                      </VStack>
                    </Box>
                  </HStack>
                </Box>

                <Box
                  padding="5rem 2rem 0 2rem"
                  position="relative"
                  boxShadow="lg"
                >
                  <Box
                    bg="#740202"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    textAlign="center"
                    padding="1rem"
                    color="white"
                  >
                    Average Grades per Year
                  </Box>

                  <GradesAverageLine studentNumber={studentNumber} />
                </Box>

                <Box
                  padding="5rem 2rem 0 2rem"
                  position="relative"
                  boxShadow="lg"
                >
                  <Box
                    bg="#740202"
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    textAlign="center"
                    padding="1rem"
                    color="white"
                  >
                    Average Grades per Semester
                  </Box>
                  <VStack spacing="3rem">
                    <Box w="62rem" h="20rem">
                      {
                        <GradesperSemester
                          studentNumber={studentNumber}
                          onGradesDataChange={handleGradesDataChange}
                        />
                      }
                    </Box>
                    <Spacer />
                    <Box alignItems="center" w="50rem" h="6rem" padding="1rem">
                      {latestGradeInfo ? (
                        <>
                          <Text fontSize="15px" fontWeight="semibold">
                            You have a grade of {latestGradeInfo.grade} in{" "}
                            {latestGradeInfo.year}, {latestGradeInfo.semester}{" "}
                          </Text>
                          <Text fontSize="15px" fontWeight="semibold">
                            {latestGradeInfo.grade === 5 &&
                              student.status !== "Regular" &&
                              "Keep going, it's not yet the end."}
                            {latestGradeInfo.grade > 1.6 &&
                              latestGradeInfo.grade <= 3 &&
                              "Keep up the good work!"}
                            {latestGradeInfo.grade > 1.5 &&
                              latestGradeInfo.grade <= 1.6 &&
                              student.status === "Regular" &&
                              "Congratulations, your grade is fit for Dean's List!"}
                            {latestGradeInfo.grade >= 1.0 &&
                              latestGradeInfo.grade <= 1.5 &&
                              student.status === "Regular" &&
                              "Congratulations, your grade is fit for President's Lister. Keep up the good work!"}
                            {latestGradeInfo.grade !== 5 &&
                              student.status === "Regular" &&
                              "Congratulations, You did great!"}
                          </Text>
                        </>
                      ) : (
                        <Text fontWeight="semibold">
                          No grade information available.
                        </Text>
                      )}
                    </Box>
                  </VStack>
                </Box>
                <Box
                  w="65rem"
                  padding="2rem 2rem 2rem 2rem"
                  position="relative"
                  boxShadow="lg"
                >
                  <VStack spacing="5rem">
                    <Box
                      bg="#740202"
                      position="absolute"
                      top="0"
                      left="0"
                      right="0"
                      textAlign="center"
                      padding="1rem"
                      color="white"
                    >
                      Courses
                    </Box>
                    <Overstay studentNumber={studentNumber} />
                  </VStack>
                </Box>
              </VStack>
            </Flex>
          </Wrap>
          {isModalOpen && (
            <History
              onClose={closeModal}
              studentNumber={studentNumber}
              totalCreditUnits={totalCreditUnits}
              validatedTotalUnits={validatedTotalUnits}
              remainingCreditUnits={remainingCreditUnits}
            />
          )}
        </Flex>
      )}
    </div>
  );
}

StudentAnalytics.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  evalYearValue: PropTypes.string.isRequired,
  evalSemValue: PropTypes.string.isRequired,
};
export default StudentAnalytics;
