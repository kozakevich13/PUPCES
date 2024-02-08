import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { RiFileList3Line } from "react-icons/ri";
import Vec from "../../../assets/Vector.png";
import { endPoint } from "../../config";
import FemaleStudents from "./Modal/FemaleStudents";
import MaleStudents from "./Modal/MaleStudents";
import TotalStudents from "./Modal/TotalStudent";

function Card() {
  const [programName, setProgramName] = useState("");
  const [facultyprogram, setFacultyProgram] = useState();
  const facultyEmail = Cookies.get("facultyEmail");
  const [totalStudents, setTotalStudents] = useState(0);
  const [femaleStudents, setFemaleStudents] = useState(0);
  const [maleStudents, setMaleStudents] = useState(0);
  const [isTotalStudentsModalOpen, setIsTotalStudentsModalOpen] =
    useState(false);
  const [isFemaleModalOpen, setIsFemaleModalOpen] = useState(false);
  const [isMaleModalOpen, setIsMaleModalOpen] = useState(false);
  console.log("faculty email in cookies:", facultyEmail);

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
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === facultyprogram
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
  }, [facultyprogram]);

  useEffect(() => {
    // Fetch and count all students with the specified program_id
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        const allStudents = response.data;
        const studentsWithProgramId = allStudents.filter(
          (student) => student.program_id === facultyprogram
        );
        setTotalStudents(studentsWithProgramId.length);
        console.log(" studentsWithProgramId", studentsWithProgramId);

        // Count female students
        const femaleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Female"
        ).length;
        setFemaleStudents(femaleStudentsCount);

        // Count male students
        const maleStudentsCount = studentsWithProgramId.filter(
          (student) => student.gender === "Male"
        ).length;
        setMaleStudents(maleStudentsCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram]);

  const handleButtonTotalClicked = () => {
    setIsTotalStudentsModalOpen(true);
  };
  const handleMaleButton = () => {
    setIsMaleModalOpen(true);
  };

  const handleFemaleButton = () => {
    setIsFemaleModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsTotalStudentsModalOpen(false);
    setIsFemaleModalOpen(false);
    setIsMaleModalOpen(false);
  };

  console.log(totalStudents);
  return (
    <VStack display="flex" justifyContent="space-between">
      <Text fontWeight="bold" fontSize="25px">
        {programName}
      </Text>
      <VStack>
        <HStack flexDirection={{ base: "column", md: "row" }}>
          {/* Total Student */}
          <Box
            width="100%"
            height="12rem"
            bgColor="#740202"
            borderRadius="8px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            overflow="hidden"

            // background="linear-gradient(to top,transparent, #740202)"
          >
            <HStack padding="1rem 2rem" justifyContent="space-between">
              <Text fontSize="20px" color="white">
                Total Students
              </Text>
              <Button onClick={handleButtonTotalClicked}>
                {" "}
                <RiFileList3Line fontSize={20} />
              </Button>
            </HStack>
            <Text fontSize="25px" padding="0  2rem 0 " color="white">
              {totalStudents}
            </Text>
            {/* <Image
              opacity={0.3}
              // mt="2rem"
              w="19rem"
              h="5.4rem"
              src={Vec}
            /> */}
          </Box>

          {/* Totat Female */}
          <Box
            width="100%"
            height="12rem"
            bgColor="#5F8670"
            borderRadius="8px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            overflow="hidden"

            // background="linear-gradient(to top,transparent, #740202)"
          >
            <HStack padding="1rem 2rem" justifyContent="space-between">
              <Text fontSize="20px" color="white">
                Female Students
              </Text>
              <Button onClick={handleFemaleButton}>
                {" "}
                <RiFileList3Line fontSize={20} />
              </Button>
            </HStack>
            <Text fontSize="25px" padding="0  2rem 0 " color="white">
              {femaleStudents}
            </Text>

            {/* <Image
              opacity={0.3}
              // mt="2rem"
              w="19rem"
              h="5.4rem"
              src={Vec}
            /> */}
          </Box>
          {/* Total Male */}
          <Box
            width="100%"
            height="12rem"
            bgColor="#FF9800"
            borderRadius="8px"
            boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            overflow="hidden"

            // background="linear-gradient(to top,transparent, #740202)"
          >
            <HStack padding="1rem 2rem" justifyContent="space-between">
              <Text fontSize="20px" color="white">
                Male Students
              </Text>
              <Button onClick={handleMaleButton}>
                {" "}
                <RiFileList3Line fontSize={20} />
              </Button>
            </HStack>

            <Text fontSize="25px" padding="0  2rem 0 " color="white">
              {maleStudents}
            </Text>
            {/* <Image
              opacity={0.3}
              // mt="2rem"
              w="19rem"
              h="5.4rem"
              src={Vec}
            /> */}
          </Box>
        </HStack>

        <Text mt="5rem">
          There is a total of {totalStudents} student(s) in {programName} with
          the total of {femaleStudents} Female Student(s) and {maleStudents}{" "}
          Male Student(s)
        </Text>
      </VStack>

      <TotalStudents
        isOpen={isTotalStudentsModalOpen}
        onClose={handleCloseModal}
      />
      <FemaleStudents isOpen={isFemaleModalOpen} onClose={handleCloseModal} />
      <MaleStudents isOpen={isMaleModalOpen} onClose={handleCloseModal} />
    </VStack>
  );
}
export default Card;
