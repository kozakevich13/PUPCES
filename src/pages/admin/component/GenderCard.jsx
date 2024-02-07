import { Card, CardBody, CardHeader, Divider } from "@chakra-ui/react";

import { HStack } from "@chakra-ui/react";
import GenderPie from "./Graphs/StudentGenderPie";
import FacultyGenderPie from "./Graphs/FacultyGenderPie";
function Gender() {
  return (
    <HStack gap="3rem">
      <Card w="38rem" h="30rem" boxShadow="2xl" borderRadius="30px">
        <CardHeader>Students by Gender</CardHeader>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          <GenderPie />
        </CardBody>
      </Card>
      <Card w="38rem" h="30rem" boxShadow="2xl" borderRadius="30px">
        <CardHeader>Faculty by Gender</CardHeader>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          
          <FacultyGenderPie />
        </CardBody>
      </Card>
      
    </HStack>
  );
}

export default Gender;
