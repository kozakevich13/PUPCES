import {
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";
import breakPoints from "../../../utils/breakpoint";
import EvaluationTable from "./evaluationTable";
import { endPoint } from "../../config";

export default function Evaluation() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [filteredStudentCount, setFilteredStudentCount] = useState(0);
  const [showTableBody, setShowTableBody] = useState(false);

  const [currentStudentNumber, setCurrentStudentNumber] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isUsersDataVisible, setIsUsersDataVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [facultyprogram, setFacultyProgram] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  const [facultyId, setFacultyId] = useState("");
  // fetch Faculty
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyId(facultyData.faculty_id);
          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  console.log("Program id", facultyprogram);

  //   const handleStudentChangeCallback = (studentNumber) => {
  //     console.log(
  //       "Student Change Callback - Selected Student Number:",
  //       studentNumber
  //     );

  //  //   setStudentNumber(studentNumber);
  //     console.log("Updated selectedStudentNumber:", studentNumber);
  //   };

  //   const handleEvalYearandSemChange = (
  //     studentNumber,
  //     evalYearValue,
  //     evalSemValue
  //   ) => {
  //     console.log("Student Number:", studentNumber);
  //       setStudentNumber(studentNumber);
  //     setEvalYearValue((prevEvalYearValue) => {
  //       const updatedEvalYearValue = {
  //         ...prevEvalYearValue,
  //         [studentNumber]: evalYearValue,
  //       };
  //       console.log("Updated evalYearValue:", updatedEvalYearValue);
  //       return updatedEvalYearValue;
  //     });

  //     setEvalSemValue((prevEvalSemValue) => {
  //       const updatedEvalSemValue = {
  //         ...prevEvalSemValue,
  //         [studentNumber]: evalSemValue,
  //       };
  //       console.log("Updated evalSemValue:", updatedEvalSemValue);
  //       return updatedEvalSemValue;
  //     });
  //   };

  //fetch student
  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${encodeURIComponent(facultyprogram)}`)
      .then((response) => {
        console.log("Fetched Students:", response.data);
        setStudents(response.data);
        setStudentNumber(response.data.student_number);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [facultyprogram]);

  //filter status
  useEffect(() => {
    console.log("Selected Filters:", selectedStatus);

    const newFilteredStudents = students.filter((student) => {
      const statusMatch =
        selectedStatus === "" || student.status === selectedStatus;

      return selectedStatus === "All Students" || statusMatch;
    });

    setFilteredStudents(newFilteredStudents);
    setFilteredStudentCount(newFilteredStudents.length);
  }, [selectedStatus, students]);

  // Filter by year
  useEffect(() => {
    console.log("Selected Filters:", selectedSchoolYear);

    const newFilteredYear = students.filter((student) => {
      // Calculate student year level
      const studentYear = parseInt(student.student_number.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      const academicYearStartMonth = 9; // September
      const isNewAcademicYear =
        new Date().getMonth() + 1 >= academicYearStartMonth;

      const calculatedYearLevel = isNewAcademicYear
        ? currentYear - studentYear + 1
        : currentYear - studentYear;

      console.log("Calculated Year Level:", calculatedYearLevel);

      // Check if the calculated year level matches the selected year
      const yearLevelMatch =
        selectedSchoolYear === "All Years" ||
        calculatedYearLevel.toString() === selectedSchoolYear.toString(); // Convert to string for strict comparison

      console.log("Year Level Match (after comparison):", yearLevelMatch);

      console.log("Filtered Student:", student);

      return selectedSchoolYear === "All Years" || yearLevelMatch;
    });

    console.log("Filtered Students in render:", newFilteredYear);

    setFilteredStudents(newFilteredYear);
    setFilteredStudentCount(newFilteredYear.length);
  }, [selectedSchoolYear, students]);

  useEffect(() => {
    if (
      currentStudentNumber &&
      !filteredStudents.some(
        (student) => student.student_number === currentStudentNumber
      )
    ) {
      setIsUsersDataVisible(false);
      setCurrentStudentNumber(null);
    }
  }, [currentStudentNumber, filteredStudents]);

  useEffect(() => {
    setSelectedStudentNumber(null);

    setShowTableBody(selectedSchoolYear !== "" || selectedStatus !== "");
    //  console.log("Selected Filters - School Year:", selectedSchoolYear);
    //console.log("Selected Filters - Status:", selectedStatus);
    //console.log("Selected Filters - Program:", selectedProgram);
  }, [selectedSchoolYear, selectedStatus]);

  // useEffect(() => {
  //   // Your logic for rendering based on selectedYear and selectedSemester
  //   console.log("Props for UsersEvaluation:", {
  //     evalYearValue,
  //     evalSemValue,
  //     studentNumber,
  //     facultyId,
  //   });
  // }, [studentNumber, facultyId, isUsersDataVisible, evalYearValue, evalSemValue]);

  // useEffect(() => {
  //   console.log("StudentNumber:", studentNumber);
  //   console.log("evalYearValue:", evalYearValue);
  //   console.log("evalSemValue:", evalSemValue);

  //   if (
  //     studentNumber !== null &&
  //     evalYearValue[studentNumber] !== undefined &&
  //     evalSemValue[studentNumber] !== undefined
  //   ) {
  //     setIsUsersDataVisible(true);
  //   } else {
  //     setIsUsersDataVisible(false);
  //   }
  // }, [studentNumber, evalYearValue, evalSemValue]);

  // console.log(
  //   "Selected Student Number before rendering UsersEvaluation:",
  //   selectedStudentNumber
  // );
  console.log("facultyId:", facultyId);

  useEffect(() => {
    const newFilteredSearch = students.filter((student) => {
      const fullName =
        `${student.first_name} ${student.last_name}`.toLowerCase();
      const searchLower = searchQuery.toLowerCase();

      return fullName.includes(searchLower);
    });

    setFilteredStudents(newFilteredSearch);
    setFilteredStudentCount(newFilteredSearch.length);
  }, [searchQuery, students]);

  return (
    <Flex
      minHeight="100vh"
      position="absolute"
      justifyContent="center"
      w="100%"
      flexDirection="column"
    >
      <FacultyNavbar />
      <VStack mt="12rem" w="100%">
        <Wrap spacing="3" w={breakPoints} mb="8rem">
          <HStack justify="flex-start" w="100%" flexWrap="wrap">
            <Select
              placeholder="Year Level"
              focusBorderColor="white"
              opacity=".6"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedSchoolYear}
              onChange={(event) => setSelectedSchoolYear(event.target.value)}
            >
              <option style={{ color: "black" }} value="All Years">
                All Years
              </option>
              <option style={{ color: "black" }} value="1">
                First Year
              </option>
              <option style={{ color: "black" }} value="2">
                Second Year
              </option>
              <option style={{ color: "black" }} value="3">
                Third Year
              </option>
              <option style={{ color: "black" }} value="4">
                Fourth Year
              </option>
            </Select>
            <Select
              placeholder="Status"
              focusBorderColor="white"
              opacity=".6"
              w={{ base: "100%", md: "11rem" }}
              fontSize=".9rem"
              bgColor="#EEEEEE"
              color="black"
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              value={selectedStatus}
              onChange={(event) => setSelectedStatus(event.target.value)}
            >
              <option style={{ color: "black" }} value="All Students">
                All Students
              </option>
              <option style={{ color: "black" }} value="Regular">
                Regular
              </option>
              <option style={{ color: "black" }} value="Returnee">
                Returnee
              </option>
              <option style={{ color: "black" }} value="Back Subject">
                Back Subject
              </option>
              <option style={{ color: "black" }} value="Shiftee">
                Shiftee
              </option>
              <option style={{ color: "black" }} value="Transferee">
                Transferee
              </option>
              <option style={{ color: "black" }} value="Ladderized">
                Ladderized
              </option>
            </Select>

            <InputGroup w={{ base: "100%", md: "20rem" }}>
              <Input
                p="1rem"
                fontFamily="inter"
                placeholder="Search..."
                focusBorderColor="palette.primary"
                borderColor="rgba(0, 0, 0, .2)"
                _placeholder={{
                  color: "#5C596E",
                  opacity: ".7",
                }}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <InputRightElement
                marginRight=".2rem"
                fontSize="1.2rem"
                color="#2B273E"
                opacity=".5"
                transition="all .3s ease"
                borderRadius=".5rem"

                // onClick={handleSearchIconClick}
              >
                <BsSearch />
              </InputRightElement>
            </InputGroup>

            <HStack ml="auto">
              <Text opacity={0.7}>Total:</Text>
              {showTableBody ? (
                <Text opacity={0.7}>{filteredStudentCount}</Text>
              ) : (
                <Text opacity={0.7}>0</Text>
              )}
            </HStack>
          </HStack>

          {console.log("Filtered Students in render:", filteredStudents)}
          <EvaluationTable
            students={filteredStudents}
            isLoading={isLoading}
            showTableBody={showTableBody}
          />
        </Wrap>
      </VStack>
      <Spacer mt="10rem" />
      <Footer />
    </Flex>
  );
}
