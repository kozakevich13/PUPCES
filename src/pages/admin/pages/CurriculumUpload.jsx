import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
} from "@chakra-ui/react";

import "../admin.css";

import { AiOutlinePlus } from "react-icons/ai";

function CurriculumUpload() {
  return (
    <Card w="38rem" h="10rem" boxShadow="2xl" borderRadius="30px">
      <CardHeader>Upload Curriculum</CardHeader>
      <Divider bg="gray.300" />
      <CardBody ml="2rem" justifyContent="center">
        <HStack justifyContent="center" alignContent="center" ml="4rem">
          <Button
            style={{
              backgroundColor: "#740202",
              // justifyContent: "flex-end",
              // marginLeft: "50rem",
              color: "white",
              transition: "background-color 0.3s ease, transform 0.3s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#950303";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#740202";
              e.currentTarget.style.transform = "scale(1)";
            }}
            fontWeight="semibold"
            fontStyle="bitter"
            cursor="pointer"
            w="11rem"
            focusBorderColor="white"
            leftIcon={<AiOutlinePlus />}
          >
            Upload
          </Button>

          <input type="file" />
        </HStack>
      </CardBody>
    </Card>
  );
}

export default CurriculumUpload;
