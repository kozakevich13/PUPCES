import { Card, CardBody, CardHeader, Divider } from "@chakra-ui/react";

import { Box } from "@chakra-ui/react";
import GenderPie from "./Graphs/StudentGenderPie";
import FacultyGenderPie from "./Graphs/FacultyGenderPie";
function Gender() {
  return (
    <Box
      gap="3rem"
      display="flex"
      flexDirection={{ base: "column", md: "row" }}
    >
      <Card
        w={{ base: "20rem", md: "auto", lg: "43vw" }}
        h="30rem"
        boxShadow="2xl"
        borderRadius="30px"
      >
        <CardHeader>Students by Gender</CardHeader>
        <Divider bg="gray.300" />
        <CardBody
          ml={{ base: "0rem", md: "0rem", lg: "4rem" }}
          justifyContent="center"
        >
          <GenderPie />
        </CardBody>
      </Card>
      <Card
        w={{ base: "20rem", md: "auto", lg: "43vw" }}
        h="30rem"
        boxShadow="2xl"
        borderRadius="30px"
      >
        <CardHeader>Faculty by Gender</CardHeader>
        <Divider bg="gray.300" />
        <CardBody
          ml={{ base: "0rem", md: "0rem", lg: "4rem" }}
          justifyContent="center"
        >
          <FacultyGenderPie />
        </CardBody>
      </Card>
    </Box>
  );
}

export default Gender;
