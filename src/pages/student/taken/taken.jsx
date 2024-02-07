import {
  Flex,
  HStack,
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
import bg from "../../../assets/bg.webp";
import breakPoints from "../../../utils/breakpoint";
import { Link } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";

export default function Taken() {
  return (
    <Flex
      h="100vh"
      position="absolute"
      justifyContent="center"
      w="100%"
      bgImage={`url(${bg})`}
      bgRepeat="no-repeat"
      bgPos="center"
      bgSize="cover"
      zIndex={-1}
    >
      <Link to="/studentDashboard">
        <TbArrowBackUp
          size="25px"
          style={{
            position: "absolute",
            top: "7rem",
            left: "14rem",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => (e.target.style.color = "black")}
        />
      </Link>
      <Wrap spacing="3" w={breakPoints}>
        <VStack spacing="10" align="flex-start" marginTop="10rem">
          <Text fontSize="28px" fontWeight="semibold">
            First Year
          </Text>

          <Text w="8rem" fontWeight="md" fontSize="17.5px">
            First Semester
          </Text>
        </VStack>

        <TableContainer w="100%">
          <Table variant="simple" fontFamily="inter" size="sm">
            <Thead bg="palette.primary" paddingY="2rem" h="3rem">
              <Tr>
                <Th color="palette.secondary">Course Code</Th>
                <Th color="palette.secondary">Course Title</Th>
                <Th color="palette.secondary">
                  Course Requisite / Pre-Requisite(s)
                </Th>
                <Th color="palette.secondary">Course Credit</Th>
                <Th color="palette.secondary">Grades</Th>
                <Th color="palette.secondary">Remarks</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>sds</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td>sj</Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
        <HStack>
          <Text fontWeight="bold">Validated by:</Text>
          <Text>Adviser`s Name</Text>
        </HStack>
      </Wrap>
    </Flex>
  );
}
