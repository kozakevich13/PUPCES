import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Input,
  Select,
  Table,
  Tbody,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import * as XLSX from "xlsx";
import { endPoint } from "../../config";

function Upload() {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [excelData, setExcelData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [selectedProgramId, setSelectedProgramId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [yearStartedValue, setYearStartedValue] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleAlertButtonClick = () => {
    alert("This is an alert triggered by the new button!");
  };

  const handleExcelFetch = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) {
        alert("Please select an Excel file.");
        return;
      }

      setLoading(true);

      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: "array" });
          const sheetNames = workbook.SheetNames;
          const allData = [];

          for (const sheetName of sheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            allData.push(...data);
          }

          console.log("DATA", allData);

          setExcelData(allData);
        } catch (error) {
          console.error("Error processing Excel file:", error);
          alert("Error processing Excel file.");
        } finally {
          setLoading(false);
        }
      };

      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error handling Excel file:", error);
      alert("Error handling Excel file.");
    }
  };

  //

  const fetchPrograms = async () => {
    try {
      const response = await fetch(`${endPoint}/programs`);
      if (response.ok) {
        const programsData = await response.json();
        setPrograms(programsData);
      } else {
        console.error("Error fetching programs:", response);
      }
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  const getProgramId = (programAbbr) => {
    const selectedProgram = programs.find(
      (program) => program.program_abbr === programAbbr
    );
    return selectedProgram ? selectedProgram.program_id : null;
  };

  const handleYearStartedChange = (e) => {
    const inputValue = e.target.value;
    // Only allow numeric input and limit to 4 digits
    const validatedValue = inputValue.replace(/\D/g, "").slice(0, 4);
    setYearStartedValue(validatedValue);
  };

  const processFile = async (file) => {
    try {
      setLoading(true);

      const fileReader = new FileReader();

      fileReader.onload = async (e) => {
        const workbook = XLSX.read(e.target.result, { type: "array" });
        const sheetNames = workbook.SheetNames;
        const allData = [];

        for (const sheetName of sheetNames) {
          const worksheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(worksheet);

          let foundNonEmptyRow = false;

          const filteredData = data
            .map((row, rowIndex) => {
              const isColumnNamesRow = Object.values(row).some(
                (value) =>
                  value === "year_started" ||
                  value === "course_code" ||
                  value === "course_title" ||
                  value === "credit_unit" ||
                  value === "pre_requisite" ||
                  value === "course_year" ||
                  value === "num_lab" ||
                  value === "num_lecture" ||
                  value === "program_id" ||
                  value === "course_sem"
              );

              if (!isColumnNamesRow) {
                const nonEmptyRow = Object.fromEntries(
                  Object.entries(row).filter(
                    ([key, value]) =>
                      value !== null && value !== undefined && value !== ""
                  )
                );

                const essentialColumns = ["course_code", "course_title"]; // Add other essential columns

                if (essentialColumns.every((column) => nonEmptyRow[column])) {
                  foundNonEmptyRow = true;
                  return nonEmptyRow;
                }
              }

              return null;
            })
            .filter((row) => row !== null);

          if (foundNonEmptyRow) {
            // Log the data for the current sheet to the console
            console.log(`Data for sheet ${sheetName}:`, filteredData);
          } else {
            console.log(`No valid data found in sheet ${sheetName}.`);
          }

          allData.push(...filteredData);
        }

        setExcelData(allData);
      };

      fileReader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error processing file.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("fileInput");

    if (!fileInput.files || fileInput.files.length === 0) {
      alert("Please select a file.");
      return;
    }

    const file = fileInput.files[0];

    await processFile(file);

    setIsPreviewMode(false); // Move to insertion mode
  };

  const insertRecords = async () => {
    try {
      const programId = getProgramId(selectedProgram);

      if (programId === null) {
        alert("Selected program not found.");
        return;
      }

      setSelectedProgramId(programId);

      const response = await fetch(`${endPoint}/insertData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          yearStarted: yearStartedValue,
          programId: programId,
          program: selectedProgram,
          data: excelData,
        }),
      });

      if (!response.ok) {
        console.error("Error inserting data into MySQL:", response);
        alert("Error inserting data into MySQL");
      } else {
        //    // Reset the form , empty the table and the selected excel
        // Reset the form
        setSelectedProgram("");
        setYearStartedValue("");
        // Empty the table
        setExcelData(null);
        const fileInput = document.getElementById("fileInput");
        fileInput.value = "";
        setTimeout(() => {
          setSuccessMessage("Data successfully inserted");
        }, 3000);
        console.log("Data inserted into MySQL:", response);
      }
    } catch (error) {
      console.error("Error inserting records:", error);
      alert("Error inserting records.");
    } finally {
      setIsPreviewMode(true); // Move back to preview mode
    }
  };

  return (
    <div className="wrapper">
      <Card w="69rem" h="10rem" boxShadow="2xl" borderRadius="30px">
        <CardHeader>Upload Curriculum</CardHeader>
        <Divider bg="gray.300" />
        <CardBody ml="2rem" justifyContent="center">
          <HStack>
            <Select
              w="10rem"
              placeholder="Program"
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              id="programInput"
            >
              {programs.map((program) => (
                <option key={program.program_id} value={program.program_abbr}>
                  {program.program_abbr}
                </option>
              ))}
            </Select>
            <HStack>
              <Input
                id="yearStartedInput"
                placeholder="Year Started"
                value={yearStartedValue}
                onChange={handleYearStartedChange}
              />
            </HStack>
            <HStack justifyContent="center" alignContent="center" ml="4rem">
              <Button
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
                fontWeight="semibold"
                fontStyle="bitter"
                cursor="pointer"
                w="11rem"
                focusBorderColor="white"
                leftIcon={<AiOutlinePlus />}
                onClick={isPreviewMode ? handleFileSubmit : insertRecords}
                disabled={loading}
              >
                {loading
                  ? "Uploading..."
                  : isPreviewMode
                  ? "Upload"
                  : "Insert Record"}
              </Button>

              {/* This is the input file that displays the excel file that is converted from word  */}
              <input
                type="file"
                accept=".xlsx, .xls"
                id="excelInput"
                onChange={handleExcelFetch}
              />

              <label htmlFor="excelInput"></label>
              <input type="file" id="fileInput" onChange={() => {}} />
            </HStack>
            {successMessage && (
              <div style={{ color: "green", marginLeft: "1rem" }}>
                {successMessage}
              </div>
            )}
          </HStack>
        </CardBody>
      </Card>

      <div className="viewer">
        {excelData ? (
          <div>
            <div className="table-responsive">
              <Card w="69rem" boxShadow="2xl" borderRadius="30px" mt="4">
                <CardHeader>Excel Data</CardHeader>
                <Divider bg="gray.300" />
                <CardBody ml="2rem" justifyContent="center">
                  <Table variant="striped" colorScheme="teal" size="md">
                    <Thead bg="palette.primary" h="2rem">
                      <Tr>
                        {Object.keys(excelData[0]).map((key) => (
                          <th key={key} style={{ padding: "0.3rem" }}>
                            {key}
                          </th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {excelData.map((individualExcelData, index) => (
                        <tr key={index}>
                          {Object.keys(individualExcelData).map((key) => (
                            <td key={key} style={{ padding: "0.3rem" }}>
                              {individualExcelData[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </Tbody>
                  </Table>
                  <div>
                    <strong>Number of Rows:</strong> {excelData.length}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        ) : (
          <div>Upload curriculum records here</div>
        )}
      </div>
    </div>
  );
}

export default Upload;

// type Semester = {
//   name: string
//   subjectCode: number,
//   preRef: number,
//   coRef: number,
//   description: string,
//   lecHours: number,
//   creditedUnits: number,
//   tuitionHours: number,
//   totalUnits: number
// };

// type Year = {
//   year: number,
//   semester: Semester[]
// }

// type Curriculum = Year[]

// [
//   {
//     year: "",
//     semester: [
//       {
//         first: [
//           {
//             subjectCode: "",
//             preRef: 0,
//             coRef: 0,
//             description: 0,
//             lecHours: 0,
//             creditedUnits: 0,
//             tuitionHours: 0,
//           },
//         ],
//       },
//       {
//         seconds: [
//           {
//             subjectCode: "",
//             preRef: 0,
//             coRef: 0,
//             description: 0,
//             lecHours: 0,
//             creditedUnits: 0,
//             tuitionHours: 0,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     year: "",
//     semester: [
//       {
//         first: [
//           {
//             subjectCode: "",
//             preRef: 0,
//             coRef: 0,
//             description: 0,
//             lecHours: 0,
//             creditedUnits: 0,
//             tuitionHours: 0,
//           },
//         ],
//       },
//       {
//         seconds: [
//           {
//             subjectCode: "",
//             preRef: 0,
//             coRef: 0,
//             description: 0,
//             lecHours: 0,
//             creditedUnits: 0,
//             tuitionHours: 0,
//           },
//         ],
//       },
//     ],
//   },
// ];
