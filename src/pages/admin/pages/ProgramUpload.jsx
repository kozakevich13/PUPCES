import  { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  HStack,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { endPoint } from "../../config";

function ProgramUpload() {
  const [programName, setProgramName] = useState("");
  const [programAbbreviation, setProgramAbbreviation] = useState("");
  const toast = useToast();

const handleAddProgram = async () => {
  try {
    const response = await fetch(`${endPoint}/program`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program_name: programName,
        program_abbr: programAbbreviation,
      }),
    });

    if (response.ok) {
      // Handle success
      toast({
        title: "Program added successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setProgramName(""); // Clear input field
      setProgramAbbreviation(""); // Clear input field
    } else {
      // Handle errors
      const errorData = await response.text();

      console.log("Error response:", response);
      console.log("Error data:", errorData);

      if (errorData.includes("specific_error_message")) {
        console.error("Specific error occurred:", errorData);

        toast({
          title: "Specific error occurred",
          description: "An error occurred with specific details.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        console.error("General error occurred:", errorData);

        toast({
          title: "Error adding program",
          description: "An error occurred while adding the program.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);

    toast({
      title: "Unexpected error",
      description: "An unexpected error occurred.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};



  return (
    <Card w="92%" h="20rem" boxShadow="2xl" borderRadius="30px">
      <CardHeader>Add Program List</CardHeader>
      <Divider bg="gray.300" />
      <CardBody padding="2rem 0 0  12rem" justifyContent="center">
        <HStack gap="3rem">
          <Text>Program Name:</Text>
          <Input
            type="text"
            placeholder=" Program Name"
            mb="2"
            width="600px"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
          />
        </HStack>

        <HStack mt="2rem" gap="4rem">
          <Text>Abbreviation:</Text>
          <Input
            type="text"
            placeholder=" Program Abbreviation"
            mb="4"
            width="600px"
            value={programAbbreviation}
            onChange={(e) => setProgramAbbreviation(e.target.value)}
          />
        </HStack>
      </CardBody>
      <CardFooter justifyContent="flex-end">
        <Button
          mr="18rem"
          style={{
            backgroundColor: "#740202",
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
          w="12rem"
          onClick={handleAddProgram}
        >
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ProgramUpload;
