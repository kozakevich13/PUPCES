import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import PieChart from "../Apexchart/PieChart";
import ListPerYearModal from "../Modal/ListPerYearModal";
import { endPoint } from "../../../config";

function StudentPerYear() {
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const [selectedLabel, setSelectedLabel] = useState(null);
  const [firstYearCount, setFirstYearCount] = useState(0);
  const [secondYearCount, setSecondYearCount] = useState(0);
  const [thirdYearCount, setThirdYearCount] = useState(0);
  const [fourthYearCount, setFourthYearCount] = useState(0);

  const [firstYearMaleCount, setFirstYearMaleCount] = useState(0);
  const [firstYearFemaleCount, setFirstYearFemaleCount] = useState(0);
  const [secondYearMaleCount, setSecondYearMaleCount] = useState(0);
  const [secondYearFemaleCount, setSecondYearFemaleCount] = useState(0);
  const [thirdYearMaleCount, setThirdYearMaleCount] = useState(0);
  const [thirdYearFemaleCount, setThirdYearFemaleCount] = useState(0);
  const [fourthYearMaleCount, setFourthYearMaleCount] = useState(0);
  const [fourthYearFemaleCount, setFourthYearFemaleCount] = useState(0);

  const [firstYearStudents, setFirstYearStudents] = useState([]);
  const [secondYearStudents, setSecondYearStudents] = useState([]);
  const [thirdYearStudents, setThirdYearStudents] = useState([]);
  const [fourthYearStudents, setFourthYearStudents] = useState([]);
  const [facultyprogram, setFacultyProgram] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  //fetch faculty program
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    console.log("Faculty Program:", facultyprogram);
  }, [facultyprogram]);

  //fetch student
  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${facultyprogram}`)
      .then((response) => {
        const data = response.data;
        console.log("Data from API:", data);

        setFirstYearStudents([]);
        setSecondYearStudents([]);
        setThirdYearStudents([]);
        setFourthYearStudents([]);
        // Reset counts to 0 before updating
        setFirstYearCount(0);
        setSecondYearCount(0);
        setThirdYearCount(0);
        setFourthYearCount(0);

        setFirstYearMaleCount(0);
        setFirstYearFemaleCount(0);
        setSecondYearMaleCount(0);
        setSecondYearFemaleCount(0);
        setThirdYearMaleCount(0);
        setThirdYearFemaleCount(0);
        setFourthYearMaleCount(0);
        setFourthYearFemaleCount(0);

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = currentMonth >= 10 ? 2024 : 2023;

        console.log("Current Month:", currentMonth);
        console.log("Current Year:", currentYear);

        data.forEach((student) => {
          if (student.student_number) {
            const studentYear = parseInt(
              student.student_number.substring(0, 4),
              10
            );
            const yearIndex = currentYear - studentYear + 1;

            switch (yearIndex) {
              case 1:
                setFirstYearCount((prevCount) => prevCount + 1);
                if (student.gender === "Male") {
                  setFirstYearMaleCount((prevMaleCount) => prevMaleCount + 1);
                } else if (student.gender === "Female") {
                  setFirstYearFemaleCount(
                    (prevFemaleCount) => prevFemaleCount + 1
                  );
                }
                setFirstYearStudents((prevStudents) => [
                  ...prevStudents,
                  student,
                ]);
                break;
              case 2:
                setSecondYearCount((prevCount) => prevCount + 1);
                if (student.gender === "Male") {
                  setSecondYearMaleCount((prevMaleCount) => prevMaleCount + 1);
                } else if (student.gender === "Female") {
                  setSecondYearFemaleCount(
                    (prevFemaleCount) => prevFemaleCount + 1
                  );
                }
                setSecondYearStudents((prevStudents) => [
                  ...prevStudents,
                  student,
                ]);
                break;
              case 3:
                setThirdYearCount((prevCount) => prevCount + 1);
                if (student.gender === "Male") {
                  setThirdYearMaleCount((prevMaleCount) => prevMaleCount + 1);
                } else if (student.gender === "Female") {
                  setThirdYearFemaleCount(
                    (prevFemaleCount) => prevFemaleCount + 1
                  );
                }
                setThirdYearStudents((prevStudents) => [
                  ...prevStudents,
                  student,
                ]);
                break;
              case 4:
                setFourthYearCount((prevCount) => prevCount + 1);
                if (student.gender === "Male") {
                  setFourthYearMaleCount((prevMaleCount) => prevMaleCount + 1);
                } else if (student.gender === "Female") {
                  setFourthYearFemaleCount(
                    (prevFemaleCount) => prevFemaleCount + 1
                  );
                }
                setFourthYearStudents((prevStudents) => [
                  ...prevStudents,
                  student,
                ]);
                break;
              default:
                console.log("Invalid Year Index:", yearIndex);
                break;
            }
          }
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram]);

  useEffect(() => {
    // Log counts after updating state
    console.log("Counts after update:", {
      firstYearCount,
      secondYearCount,
      thirdYearCount,
      fourthYearCount,
      firstYearMaleCount,
      firstYearFemaleCount,
      secondYearMaleCount,
      secondYearFemaleCount,
      thirdYearMaleCount,
      thirdYearFemaleCount,
      fourthYearMaleCount,
      fourthYearFemaleCount,
    });

    // Display counts after updating state
    console.log("Displaying counts:", {
      firstYearCount,
      secondYearCount,
      thirdYearCount,
      fourthYearCount,
    });
    setIsLoading(false);
  }, [
    firstYearCount,
    secondYearCount,
    thirdYearCount,
    fourthYearCount,
    firstYearMaleCount,
    firstYearFemaleCount,
    secondYearMaleCount,
    secondYearFemaleCount,
    thirdYearMaleCount,
    thirdYearFemaleCount,
    fourthYearMaleCount,
    fourthYearFemaleCount,
  ]);

  // Add this useEffect block to log counts after the initial fetch
  useEffect(() => {
    // Log counts after the initial fetch
    console.log("Counts after initial fetch:", {
      firstYearCount,
      secondYearCount,
      thirdYearCount,
      fourthYearCount,
      firstYearMaleCount,
      firstYearFemaleCount,
      secondYearMaleCount,
      secondYearFemaleCount,
      thirdYearMaleCount,
      thirdYearFemaleCount,
      fourthYearMaleCount,
      fourthYearFemaleCount,
    });
  }, [
    firstYearCount,
    secondYearCount,
    thirdYearCount,
    fourthYearCount,
    firstYearMaleCount,
    firstYearFemaleCount,
    secondYearMaleCount,
    secondYearFemaleCount,
    thirdYearMaleCount,
    thirdYearFemaleCount,
    fourthYearMaleCount,
    fourthYearFemaleCount,
  ]);

  console.log("First Year Student", firstYearStudents);
  console.log("Second Year Student", secondYearStudents);
  console.log("Third Year Student", thirdYearStudents);
  console.log("Fourth Year Student", fourthYearStudents);

  const handleLabelSelect = (selectedLabel) => {
    console.log("Selected Label:", selectedLabel);
    // Do something with the selected label
    setSelectedLabel(selectedLabel);
  };

  const handleCloseBox = () => {
    setSelectedLabel(null); // Close the box by resetting selectedLabel
  };

  const handleButtonClicked = () => {
    // Set the selected students based on the selectedLabel
    switch (selectedLabel) {
      case "First Year":
        setSelectedStudents(firstYearStudents);
        break;
      case "Second Year":
        setSelectedStudents(secondYearStudents);
        break;
      case "Third Year":
        setSelectedStudents(thirdYearStudents);
        break;
      case "Fourth Year":
        setSelectedStudents(fourthYearStudents);
        break;
      default:
        setSelectedStudents([]); // Handle other cases if needed
    }

    // Open the modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const getTotalStudentsForLabel = () => {
    switch (selectedLabel) {
      case "First Year":
        return firstYearCount;
      case "Second Year":
        return secondYearCount;
      case "Third Year":
        return thirdYearCount;
      case "Fourth Year":
        return fourthYearCount;
      default:
        return 0;
    }
  };
  const getMaleCountForLabel = () => {
    switch (selectedLabel) {
      case "First Year":
        return firstYearMaleCount;
      case "Second Year":
        return secondYearMaleCount;
      case "Third Year":
        return thirdYearMaleCount;
      case "Fourth Year":
        return fourthYearMaleCount;
      default:
        return 0; // default value or handle other cases if needed
    }
  };

  const getFemaleCountForLabel = () => {
    switch (selectedLabel) {
      case "First Year":
        return firstYearFemaleCount;
      case "Second Year":
        return secondYearFemaleCount;
      case "Third Year":
        return thirdYearFemaleCount;
      case "Fourth Year":
        return fourthYearFemaleCount;
      default:
        return 0; // default value or handle other cases if needed
    }
  };

  return (
    <Card mt="2rem" w="100%" h="50rem" boxShadow="2xl" borderRadius="30px">
      <CardHeader>Students by Year</CardHeader>
      <Divider bg="gray.300" />
      <CardBody ml="2rem" justifyContent="center">
        <HStack spacing="-5" justifyContent="center" alignContent="center">
          <Box>
            <PieChart onLabelSelect={handleLabelSelect} />
          </Box>

          <Box
            display={selectedLabel ? "block" : "none"}
            width="35rem"
            height="18rem"
            borderRadius="8px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.3)"
            padding="2rem 2rem"
          >
            <HStack justifyContent="space-between">
              <Text> {selectedLabel}</Text>
              {selectedLabel && (
                <IoCloseCircleOutline
                  onClick={handleCloseBox}
                  cursor="pointer"
                  style={{ fontSize: "20px" }} // Adjust the font size as needed
                />
              )}
            </HStack>
            <HStack mt="1rem">
              <Text fontWeight="semibold" fontSize="13px">
                Students:
              </Text>
              <Text> {getTotalStudentsForLabel()} student</Text>
            </HStack>

            <HStack mt="1rem" spacing="2rem">
              <Text fontWeight="semibold" fontSize="13px">
                Male:{" "}
              </Text>
              <Text> {getMaleCountForLabel()} student(s)</Text>
            </HStack>

            <HStack mt="1rem" spacing="2rem">
              <Text fontWeight="semibold" fontSize="13px">
                Female:
              </Text>
              <Text>{getFemaleCountForLabel()} student(s) </Text>
            </HStack>

            <Button mt="2rem" onClick={handleButtonClicked}>
              See Class List
            </Button>
          </Box>
        </HStack>
        {console.log(
          "Selected Label in passing in Listper year:",
          selectedLabel
        )}
        <ListPerYearModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          students={selectedStudents}
          selectedLabel={selectedLabel}
        />
      </CardBody>
    </Card>
  );
}

export default StudentPerYear;
