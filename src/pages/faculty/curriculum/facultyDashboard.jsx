import {
  Box,
  Button,
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import Cookies from "js-cookie";
import moment from "moment";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import * as xlsx from "xlsx";
import Footer from "../../../components/footer/footer";
import FacultyNavbar from "../../../components/navbar/facultynavbar";
import breakPoints from "../../../utils/breakpoint";

import UsersData from "../userData/usersData";
import FacultyTable from "./facultyTable";
import { endPoint } from "../../config";

function convertExcelDatesToReadable(dates) {
  const convertedDates = dates.map((excelValue, index) => {
    try {
      if (excelValue === undefined || isNaN(excelValue)) {
        console.error(`Invalid date value at index ${index}: ${excelValue}`);
        return null; // Skip the invalid date
      }

      const millisecondsPerDay = 24 * 60 * 60 * 1000;
      const daysSinceExcelStart = excelValue - 1;
      const millisecondsSinceExcelStart =
        daysSinceExcelStart * millisecondsPerDay;
      const excelStartDate = new Date(1900, 0, 1);
      const dateValue = new Date(
        excelStartDate.getTime() + millisecondsSinceExcelStart
      );

      // Check if the date is valid
      if (isNaN(dateValue.getTime())) {
        console.error(`Invalid date value at index ${index}: ${excelValue}`);
        return null; // Skip the invalid date
      }

      // 'YYYY-MM-DD'
      const formattedDate = dateValue.toISOString().split("T")[0];
      return formattedDate;
    } catch (error) {
      console.error(`Error converting date at index ${index}: ${error}`);
      return null; // Skip the invalid date
    }
  });

  return convertedDates.filter((date) => date !== null); // Remove null values
}

export default function FacultyDashboard() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const toast = useToast();

  const [filteredStudentCount, setFilteredStudentCount] = useState(0);
  const [showTableBody, setShowTableBody] = useState(false);
  // const [searchQuery, setSearchQuery] = useState("");

  const [isUsersDataVisible, setIsUsersDataVisible] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [file, setFile] = useState(null);
  const [currentStudentNumber, setCurrentStudentNumber] = useState(null);
  const [selectedStudentNumber, setSelectedStudentNumber] = useState(null);
  const [selectedStrand, setSelectedStrand] = useState("");

  const [selectedProgramForView, setSelectedProgramForView] = useState(null);

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [facultyprogram, setFacultyProgram] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  const [facultyName, setFacultyName] = useState("");
  console.log("faculty email in cookies:", facultyEmail);
  const [facultyId, setFacultyId] = useState("");

  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyName(
            `${facultyData.faculty_fname} ${facultyData.faculty_mname} ${facultyData.faculty_lname}`
          );
          setFacultyId(facultyData.faculty_id);
          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  console.log("Program id", facultyprogram);

  const handleToggleUsersData = (studentNumber) => {
    const selectedStudent = filteredStudents.find(
      (student) => student.student_number === studentNumber
    );

    if (selectedStudent) {
      setSelectedStrand(selectedStudent.strand);
      setStudentNumber(studentNumber);
      setCurrentStudentNumber(studentNumber);

      setSelectedProgramForView(facultyprogram);
      setIsUsersDataVisible(true);

      // Log information for debugging
      console.log(`Scrolling to userData-${studentNumber}`);
      console.log(
        "Element exists:",
        document.getElementById(`userData-${studentNumber}`)
      );

      // Scroll to the UsersData wrapper div
      const userDataWrapper = document.getElementById(
        `userData-${studentNumber}`
      );
      if (userDataWrapper) {
        userDataWrapper.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      setIsUsersDataVisible(false);
    }
  };

  useEffect(() => {
    if (isUsersDataVisible && currentStudentNumber) {
      // Wait for the next frame to ensure the DOM is updated
      requestAnimationFrame(() => {
        const userDataWrapper = document.getElementById(
          `userData-${currentStudentNumber}`
        );
        if (userDataWrapper) {
          userDataWrapper.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  }, [isUsersDataVisible, currentStudentNumber]);

  const handleStudentNumberClick = (studentNumber) => {
    console.log("studentNumber:", studentNumber);
    console.log("facultyId:", facultyId);
  };

  //fetch student
  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${encodeURIComponent(facultyprogram)}`)
      .then((response) => {
        setStudents(response.data);
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

  //filter
  useEffect(() => {
    console.log("Selected Filters:", selectedSchoolYear);

    const newFilteredYear = students.filter((student) => {
      // Calculate student year level
      const studentYear = parseInt(student.student_number.substring(0, 4), 10);
      const currentYear = new Date().getFullYear();
      const academicYearStartMonth = 9; // September
      const isNewAcademicYear =
        new Date().getMonth() + 1 >= academicYearStartMonth; // Adding 1 to get the current month in the range [1-12]

      const calculatedYearLevel = isNewAcademicYear
        ? currentYear - studentYear + 1
        : currentYear - studentYear;

      console.log("Calculated Year Level:", calculatedYearLevel);

      // Check if the calculated year level matches the selected year
      const yearLevelMatch =
        selectedSchoolYear === "All Years" ||
        calculatedYearLevel.toString() === selectedSchoolYear;

      console.log("Year Level Match (after comparison):", yearLevelMatch);

      console.log("Student Year:", studentYear);
      console.log("Calculated Year Level:", calculatedYearLevel);

      console.log("Selected School Year:", selectedSchoolYear);
      console.log("Year Level Match:", yearLevelMatch);

      console.log("Filtered Student:", student);

      return selectedSchoolYear === "All Years" || yearLevelMatch;
    });

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

  const insertDataIntoDatabase = async (data) => {
    if (!Array.isArray(data)) {
      return;
    }
    for (const student of data) {
      try {
        const isValidDate = moment(
          student.birthdate,
          "YYYY-MM-DD",
          true
        ).isValid();
        if (!isValidDate) {
          console.error(
            `Invalid birthdate for student ${student.student_number}: ${student.birthdate}`
          );
          continue;
        }
      } catch (error) {
        console.error("Error inserting data:", error);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      const response = await fetch(`${endPoint}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();
        insertDataIntoDatabase(responseData);
        toast({
          title: "Success",
          description: "File uploaded successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "File upload failed.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      const workbook = xlsx.read(fileContent, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(worksheet);

      console.log(
        "Raw Date Values:",
        data.map((row) => row.birthdate)
      );

      console.log("Parsed Data:", data);

      const excelDateValues = data.map((row) => row.birthdate);

      const convertedDates = convertExcelDatesToReadable(excelDateValues);
      const dataWithConvertedDates = data.map((row, index) => ({
        ...row,
        birthdate: convertedDates[index],
      }));
      // Filter out entries with undefined birthdate
      const filteredData = dataWithConvertedDates.filter(
        (row) => row.birthdate !== undefined
      );

      console.log("Filtered Data:", filteredData);
      console.log("Converted Dates:", convertedDates);

      insertDataIntoDatabase(dataWithConvertedDates);
      console.log("Converted Dates:", convertedDates);
      console.log("Converted Dates:", dataWithConvertedDates);
    };

    reader.readAsBinaryString(selectedFile);
  };

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

  console.log(facultyId);
  return (
    <Flex
      minHeight="100vh"
      position="absolute"
      justifyContent="center"
      alignItems="center"
      w="100%"
      flexDirection="column"
    >
      <FacultyNavbar />

      {/* <VStack mt="9rem" w="80vw"> */}
      {/* <Wrap spacing="3" w={breakPoints} mb="8rem"> */}
      <Box mt="9rem" w="80vw">
        <VStack gap="3rem">
          <Box
            bg="#E3B04B"
            w="100%"
            boxShadow="lg"
            minH="8rem"
            height="auto"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            borderRadius="20px"
            overflow="hidden"
            flexWrap="wrap"
            padding="2rem"
            gap={2}
          >
            <Text
              fontSize="20px"
              fontWeight="semibold"
              fontStyle="Bitter"
              textAlign="center"
            >
              Faculty Name: {facultyName}
            </Text>

            <HStack spacing={3} flexWrap="wrap">
              <Button
                onClick={handleUpload}
                bg="palette.primary"
                color="white"
                fontWeight="semibold"
                fontStyle="bitter"
                cursor="pointer"
                w="11rem"
                focusBorderColor="white"
                leftIcon={<AiOutlinePlus />}
                _hover={{
                  bg: "palette.primaryDark",
                  transition: "background-color 0.3s",
                }}
              >
                Upload Classlist
              </Button>

              <input
                type="file"
                onChange={handleFileChange}
                style={{
                  cursor: "pointer",
                }}
              />
            </HStack>
          </Box>

          <HStack justify="flex-start" w="100%" flexWrap="wrap">
            <Select
              placeholder="Year Level"
              focusBorderColor="white"
              opacity="1"
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
              opacity="1"
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
              <option style={{ color: "black" }} value="Regular">
                Regular
              </option>
              <option style={{ color: "black" }} value="Back Subject">
                Back Subject
              </option>
              <option style={{ color: "black" }} value="Returnee">
                Returnee
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
              <option style={{ color: "black" }} value="All Students">
                All Students
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <InputRightElement
                marginRight=".2rem"
                fontSize="1.2rem"
                color="#2B273E"
                opacity=".5"
                transition="all .3s ease"
                borderRadius=".5rem"
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
        </VStack>

        <FacultyTable
          students={filteredStudents}
          isLoading={isLoading}
          handleStudentNumberClick={handleStudentNumberClick}
          showTableBody={showTableBody}
          toggleUsersData={handleToggleUsersData}
        />
        <Flex mt="5rem">
          {isUsersDataVisible &&
            (console.log(
              "selectedProgram in UsersData:",
              selectedProgramForView
            ),
            (
              <div id={`userData-${studentNumber}`}>
                <UsersData
                  studentNumber={studentNumber}
                  facultyId={facultyId}
                  program={selectedProgramForView}
                  strand={selectedStrand}
                />
              </div>
            ))}
        </Flex>
      </Box>
      {/* </Wrap> */}
      {/* </VStack> */}
      <Spacer mt="10rem" />
      <Footer />
    </Flex>
  );
}
