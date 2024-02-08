import {
  Box,
  Flex,
  HStack,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Footer from "../../../components/footer/footer";
import Navbar from "../../../components/navbar/navbar";
import { endPoint } from "../../config";
import Overstay from "./analysis/Overstay";
import CreditUnits from "./analysis/creditUnits";
import GradesAverageLine from "./analysis/gradesAverageLine";
import GradesperSemester from "./analysis/gradesperSemester";
import Core from "./analysis/highestCore";
import Gen from "./analysis/highestGenEd";
import Major from "./analysis/highestMajor";

export default function StudentDashboard() {
  const studentNumber = Cookies.get("student_number");
  const [student, setStudent] = useState({});
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [programAbbr, setProgramAbbr] = useState();
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
  const [programName, setProgramName] = useState("");
  const [stayingYear, setStayingYear] = useState(0);
  const [endYear, setEndYear] = useState(0);
  const startingYear = studentNumber ? studentNumber.substring(0, 4) : null;

  const [programId, setProgramId] = useState();

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

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        setPrograms(programs);

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === programId
        );

        console.log("Selected Program:", selectedProgram);

        if (selectedProgram) {
          const program_name = selectedProgram.program_name;
          console.log("Program Name:", program_name);
          setProgramName(program_name);
          console.log("Program Name has been set:", program_name);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [programId]);

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
          setStatus(studentData.status);
          setProgramId(studentData.program_id);

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
          }
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [programs, studentNumber]);

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

  useEffect(() => {
    console.log("Starting Year:", startingYear);
    console.log("Staying Year:", stayingYear);

    // Convert startingYear and stayingYear to numbers and then add them
    const calculatedEndYear = Number(startingYear) + Number(stayingYear);

    // Set the calculatedEndYear in the state
    setEndYear(calculatedEndYear);

    console.log("End Year:", calculatedEndYear);
  }, [startingYear, stayingYear, setEndYear]);

  const program = parseInt(Cookies.get("program_id"), 10);
  const strand = Cookies.get("strand");
  console.log("(StudentDashboard)Program in cookie:", program);
  console.log("(Curriculum)Strand in cookie:", strand);

  // Define the function to handle total credit units change
  const handleTotalCreditUnitsChange = (totalCreditUnits) => {
    // Update state or perform any other actions
    setTotalCreditUnits(totalCreditUnits);
  };
  // Create callback functions to receive data from CreditUnits component
  const handleRemainingCreditUnitsChange = (value) => {
    setRemainingCreditUnits(value);
  };

  const handleValidatedTotalUnitsChange = (value) => {
    setValidatedTotalUnits(value);
  };

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

  if (program === 1) {
    console.log("Bachelor of Science in Information Technology");
  } else if (program === 2) {
    console.log("Diploma in Information Technology");
  } else if (program === 3) {
    console.log("Bachelor of Science in Office Administration");
  } else {
    console.log("");
  }

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
    console.log("latest Grade Info", latestGradeInfo);
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

  let graduationMessage = "";
  if (latestGradeInfo) {
    if (
      latestGradeInfo.year === "First Year" ||
      latestGradeInfo.year === "Third Year" ||
      latestGradeInfo.year === "Second Year"
    ) {
      graduationMessage = `You are estimated to graduate in ${endYear - 3}-${
        endYear - 2
      }. endyear`;
    } else if (
      latestGradeInfo.year === "Fourth Year" &&
      Math.ceil(remainingCreditUnits / 23) === 1
    ) {
      graduationMessage = `You are estimated to graduate in ${endYear - 3}-${
        endYear - 2
      } endyear.`;
    } else if (
      latestGradeInfo.year === "Fourth Year" &&
      Math.ceil(remainingCreditUnits / 23) === 3
    ) {
      graduationMessage = `You are estimated to graduate in ${endYear - 2}-${
        endYear - 1
      } endyear.`;
    } else if (
      latestGradeInfo.year === "Fourth Year" &&
      Math.ceil(remainingCreditUnits / 23) === 2
    ) {
      graduationMessage = `You are estimated to graduate in ${endYear - 2}-${
        endYear - 1
      } midyear.`;
    } else if (
      latestGradeInfo.year === "Fourth Year" &&
      Math.ceil(remainingCreditUnits / 23) === 4
    ) {
      graduationMessage = `You are estimated to graduate in ${
        endYear - 1
      }-${endYear} endyear.`;
    } else if (
      latestGradeInfo.year === "Fourth Year" &&
      Math.ceil(remainingCreditUnits / 23) === 5
    ) {
      graduationMessage = `You still have remaining courses, due to the unfortunate circumstances we advise you to transfer to another university to finish your university journey. Keep moving forward!`;
    } else {
      graduationMessage =
        "Your graduation year is not specified or does not match the expected values.";
    }
  }

  console.log("Rendering with gradesData:", gradesData);
  return (
    <Flex
      flexDirection="column"
      position="relative"
      minHeight="100vh"
      justifyContent="center"
      // alignItems="center"
    >
      <Box
        w="100%"
        pos="sticky"
        h="6rem"
        boxShadow="lg"
        top="0"
        right="0"
        bgColor="#F3F8FF"
        zIndex="1"
      >
        <Navbar />
      </Box>

      <Wrap justifyContent="center" alignContent="center" flex="30" mt="10rem">
        <HStack
          justifyContent="center"
          spacing={{ base: "1rem", md: "3rem", lg: "5rem" }}
          w="100vw"
        >
          <VStack spacing={{ base: "1rem", md: "2rem", lg: "3rem" }}>
            <Text
              fontSize={{ base: "16px", md: "20px", lg: "24px" }}
              fontWeight="semibold"
              fontStyle="Bitter"
              textAlign="center"
              ml={{ base: "0", md: "7rem" }}
            >
              {/* {student.program_id === 1
                ? "Bachelor of Science in Information Technology"
                : student.program_id === 2
                ? "Diploma in Information Technology"
                : student.program_id === 3
                ? "Bachelor of Science in Office Administration"
                : ""} */}
              {programName}
            </Text>
            <HStack>
              <Text
                fontSize={{ base: "16px", md: "20px", lg: "24px" }}
                fontWeight="semibold"
                fontStyle="Bitter"
                textAlign="center"
                ml={{ base: "0", md: "7rem" }}
              >
                {capitalizeWords(student.first_name)}{" "}
                {capitalizeWords(student.middle_name)}{" "}
                {capitalizeWords(student.last_name)}
              </Text>

              <Text
                fontSize={{ base: "16px", md: "20px", lg: "24px" }}
              >{`(${student.student_number})`}</Text>
            </HStack>
          </VStack>
          <HStack
            mt={{ base: "1rem", md: "2rem", lg: "3rem" }}
            mr={{ base: "1rem", md: "2rem", lg: "3rem" }}
          >
            <Text fontSize={{ base: "16px", md: "20px", lg: "24px" }}>
              Status:
            </Text>
            <Text
              fontSize={{ base: "16px", md: "20px", lg: "24px" }}
              fontWeight="semibold"
            >
              {status}
            </Text>
          </HStack>
        </HStack>

        <Flex ml="15rem" mt="5rem" justifyContent="flex-start">
          <VStack>
            <Box padding="5rem 5rem" boxShadow="lg">
              <Box
                bg="#740202"
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
                <Box zIndex="0">
                  {
                    <CreditUnits
                      studentNumber={studentNumber}
                      onRemainingCreditUnitsChange={
                        handleRemainingCreditUnitsChange
                      }
                      onValidatedTotalUnitsChange={
                        handleValidatedTotalUnitsChange
                      }
                      onTotalCreditUnitsChange={handleTotalCreditUnitsChange}
                    />
                  }
                </Box>
                <Spacer />
                <Box
                  alignItems="center"
                  // boxShadow="md"
                  // bg="gray.100"
                  w="25rem"
                  mt=""
                >
                  <VStack>
                    <Text
                      textAlign="center"
                      fontWeight="semibold"
                      fontSize="lg"
                      mb="4"
                      padding="1rem"
                    >
                      You have {totalCreditUnits} credit units and taken{" "}
                      {validatedTotalUnits} credit unit(s) and have{" "}
                      {remainingCreditUnits} remaining credit unit(s) to
                      complete. Keep going, you`re doing great! ✨
                    </Text>
                    <Text
                      textAlign="center"
                      fontWeight="semibold"
                      fontSize="lg"
                      mb="4"
                      padding="2rem"
                    >
                      You have {Math.ceil(remainingCreditUnits / 23)} remaining
                      semester(s) including the current semester for{"  "}
                      {Math.ceil(Math.ceil(remainingCreditUnits / 23) / 2)}
                      {"  "}
                      year(s)
                    </Text>
                  </VStack>
                </Box>
              </HStack>
            </Box>
            <Box padding="5rem 2rem 0 2rem" boxShadow="lg">
              <Box
                bg="#740202"
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

            <Box padding="5rem 2rem 0 2rem" boxShadow="lg">
              <Box
                bg="#740202"
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
                    <Text fontWeight="semibold"></Text>
                  )}
                </Box>
              </VStack>
            </Box>

            <Box w="65rem" padding="2rem 2rem 2rem 2rem" boxShadow="lg">
              <VStack spacing="5rem">
                <Box
                  bg="#740202"
                  top="0"
                  left="0"
                  right="0"
                  textAlign="center"
                  padding="1rem"
                  color="white"
                  w="100%"
                >
                  Courses
                </Box>

                <VStack padding="4rem">
                  <Text>{graduationMessage}</Text>
                  <Overstay studentNumber={studentNumber} />
                </VStack>
              </VStack>
            </Box>

            <Box w="65rem" padding="2rem 2rem 2rem 2rem" zIndex={0}>
              <Box mr="5rem" w="50rem">
                <Major />
              </Box>
            </Box>
            <Box w="65rem" padding="2rem 2rem 2rem 2rem">
              <Box mr="5rem" w="50rem">
                <Core />
              </Box>
            </Box>
            <Box w="65rem" padding="2rem 2rem 2rem 2rem">
              <Box mr="5rem" w="50rem">
                <Gen />
              </Box>
            </Box>
          </VStack>
        </Flex>
      </Wrap>
      <Spacer mt="10rem" />
      <Footer />
    </Flex>
  );
}
