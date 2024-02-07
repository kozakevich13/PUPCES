import {
  Box,
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
import { BiSave } from "react-icons/bi";
import { MdModeEditOutline } from "react-icons/md";
import bg from "../../../assets/bg.webp";
import Footer from "../../../components/footer/footer";
import breakPoints from "../../../utils/breakpoint";
import Analytics from "./analytics";
import { Link } from "react-router-dom";
import { TbArrowBackUp } from "react-icons/tb";


export default function Remaining() {
  return (
    <Flex
      h="150vh"
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

      <VStack>
        <Wrap spacing="3" w={breakPoints}>
          <VStack spacing="10" align="flex-start" marginTop="10rem">
            <Text fontSize="28px" fontWeight="semibold">
              First Year
            </Text>
            <HStack>
              <Text w="8rem" fontWeight="md" fontSize="17.5px">
                First Semester
              </Text>
              <HStack ml="46.2rem">
                <Button
                  leftIcon={<MdModeEditOutline />}
                  bg="palette.secondary"
                  color="palette.primary"
                  _hover={{ borderColor: "palette.secondary" }}
                  _focus={{ outline: "none", boxShadow: "none" }}
                >
                  Edit
                </Button>
                <Button
                  leftIcon={<BiSave />}
                  bg="palette.primary"
                  color="palette.secondary"
                  _hover={{ borderColor: "palette.primary" }}
                  _focus={{ outline: "none", boxShadow: "none" }}
                >
                  Save
                </Button>
              </HStack>
            </HStack>
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
        </Wrap>
        <Box mr="60rem" mb="2rem" mt="5rem">
          <Text fontWeight="semibol" fontSize="18px">
            Data Analysis
          </Text>
        </Box>
        <Box w="70%">
          <Analytics />
        </Box>
        <Spacer mb="5rem" />
        <Footer />
      </VStack>
    </Flex>
  );
}
