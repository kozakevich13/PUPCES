import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
} from "@chakra-ui/react";

import moment from "moment";
import { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import * as xlsx from "xlsx";
import "../admin.css";
//import Sidebar from "../component/Sidebar";
import { endPoint } from "../../config";

function convertExcelDatesToReadable(dates) {
  const convertedDates = dates.map((excelValue) => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    // Check if the excelValue is a valid number
    if (typeof excelValue !== "number" || isNaN(excelValue)) {
      console.error("Invalid date value:", excelValue);
      return null; // or handle it accordingly
    }

    const daysSinceExcelStart = excelValue - 1;
    const millisecondsSinceExcelStart =
      daysSinceExcelStart * millisecondsPerDay;
    const excelStartDate = new Date(1900, 0, 1);
    const dateValue = new Date(
      excelStartDate.getTime() + millisecondsSinceExcelStart
    );

    // Check if the resulting dateValue is valid
    if (isNaN(dateValue.getTime())) {
      console.error("Invalid date value:", excelValue);
      return null; // or handle it accordingly
    }

    // 'YYYY-MM-DD'
    const formattedDate = dateValue.toISOString().split("T")[0];
    return formattedDate;
  });

  return convertedDates;
}

function FacultyUpload() {
  const [program, setProgram] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [file, setFile] = useState(null);

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
      alert("Please select a file to upload.");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("excelFile", file);

    try {
      // Fetch programs data from the server
      const programsResponse = await fetch(`${endPoint}/programs`);
      const programsData = await programsResponse.json();

      // Append the programs array to the FormData
      formData.append("programs", JSON.stringify(programsData));

      const response = await fetch(`${endPoint}/facultyupload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully.");
        const responseData = await response.json();
        console.log("Response data:", responseData);

        if (Array.isArray(responseData)) {
          const programsResponse = await fetch(`${endPoint}/programs`);
          const programsData = await programsResponse.json();

          const selectedProgram = programsData.find(
            (p) => p.program_name === program
          );
          const programId = selectedProgram ? selectedProgram.program_id : null;

          // Include the program_id for each faculty and insert into the database
          const dataWithProgramId = responseData.map((faculty) => ({
            ...faculty,
            program_id: programId,
          }));

          console.log("Data with program_id:", dataWithProgramId);

          insertDataIntoDatabase(dataWithProgramId);

          alert("File uploaded successfully.");
        } else if (responseData && responseData.message) {
          // Handle the case where the server sends a response with a message property
          console.log("Server response message:", responseData.message);
        } else {
          console.error("Invalid response data format:", responseData);
        }
      } else {
        alert("File upload failed.");
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

      insertDataIntoDatabase(dataWithConvertedDates);
      console.log("Converted Dates:", convertedDates);
      console.log("Converted Dates:", dataWithConvertedDates);
    };

    reader.readAsBinaryString(selectedFile);
  };

  return (
    <HStack gap="3rem">
      <Card w="79rem" h="10rem" boxShadow="2xl" borderRadius="30px">
        <CardHeader>Upload Faculty List</CardHeader>
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
              onClick={handleUpload}
              fontWeight="semibold"
              fontStyle="bitter"
              cursor="pointer"
              w="11rem"
              focusBorderColor="white"
              leftIcon={<AiOutlinePlus />}
            >
              Upload
            </Button>

            <input type="file" onChange={handleFileChange} />
          </HStack>
        </CardBody>
      </Card>
    </HStack>
  );
}

export default FacultyUpload;
