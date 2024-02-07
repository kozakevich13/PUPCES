import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import Lottie from "react-lottie-player";
import NoEval from "../../../assets/noEval.json";
import Navbar from "../../../components/navbar/navbar";
import { endPoint } from "../../config";
import EvaluationAll from "./evaluationAll";

// student evaluation
function Evaluation() {
  const studentNumber = Cookies.get("student_number");
  // const program = Cookies.get("program_id");
  const strand = Cookies.get("strand");
  console.log("StudentNumber in cookie", studentNumber);

  console.log("Strand in cookie", strand);
  const [courses, setCourses] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [programId, setProgramId] = useState();
  const [programAbr, setProgramAbr] = useState("");

  const [courseType, setCourseType] = useState();
  const [remainingCreditUnits, setRemainingCreditUnits] = useState(0);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [creditUnits, setCreditUnits] = useState({});

  const [dataFetched, setDataFetched] = useState(false);
  const [validatedTotalunits, setValidatedTotalUnits] = useState(0);

  const [validatedCourse, setValidatedCourse] = useState({});
  const [facultyId, setFacultyId] = useState(null);
  const [matchedCourses, setMatchedCourses] = useState([]);
  const [startYear, setStartYear] = useState();
  //const toast = useToast();
  const [facultyDetails, setFacultyDetails] = useState(null);
  const [fname, setFname] = useState("");
  const [mname, setMname] = useState("");
  const [lname, setLname] = useState("");
  const [requiredUnits, setRequiredUnits] = useState();
  const [totalEvalCreditUnits, setTotalEvalCreditUnits] = useState(0);
  const [curriculumMap, setCurriculumMap] = useState(new Map());

  //student
  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentResponse = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );

        const studentData = studentResponse.data;
        if (studentData) {
          setFname(studentData.first_name);
          setMname(studentData.middle_name);
          setLname(studentData.last_name);
          setProgramId(studentData.program_id);
        } else {
          console.error("Empty or unexpected response:", studentResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [studentNumber]);

  //program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        // Find the program with matching program_id as a number
        const matchedProgram = programs.find(
          (program) => program.program_id === parseInt(programId, 10)
        );

        if (matchedProgram) {
          const programAbbr = matchedProgram.program_abbr;
          // Update state with program_abbr
          setProgramAbr(programAbbr);
        } else {
          console.error("Program not found for program_id:", programId);
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    // Fetch program data only if programId is defined
    if (programId !== undefined) {
      fetchProgramData();
    }
  }, [programId]);
  //fetch curriculum
  useEffect(() => {
    let courseType = "";
    if (
      studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019") ||
      studentNumber.startsWith("2018")
    ) {
      courseType = 2019;
    } else {
      courseType = 2022;
    }

    setCourseType(courseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
      )
      .then((res) => {
        const courseData = res.data;
        setCourses(courseData);

        console.log("API Response Data:", courseData);

        // Now you can use the curriculumStore to get course_code and course_title
        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);

        let totalCreditUnits = 0;
        courseData.forEach((course) => {
          // console.log(
          //   `Credit Unit for ${course.course_id}: ${course.credit_unit}`
          // );
          if (
            !(
              programId === 1 &&
              (strand === "STEM" || strand === "ICT") &&
              course.course_sem === "Bridging"
            )
          ) {
            console.log(
              `Credit Unit for ${course.course_id}: ${course.credit_unit}`
            );
            totalCreditUnits += course.credit_unit;
          }
        });

        console.log("Total Credit Units:", totalCreditUnits);
        setTotalCreditUnits(totalCreditUnits);
      })

      .catch((error) => {
        console.error("Error fetching course data:", error);
      })
      .finally(() => {
        console.log("API call done.");
      });
  }, [programId, strand, studentNumber]);

  useEffect(() => {
    setStartYear(studentNumber.substring(0, 4));

    console.log("startYear:", startYear);
  }, [startYear, studentNumber]);

  //fetch evaluate
  useEffect(() => {
    axios
      .get(
        `${endPoint}/evaluate-recommend?student_number=${studentNumber}&eval_year=${year}&eval_sem=${semester}`
      )
      .then((response) => {
        console.log("API Response:", response.data); // Log the API response
        setEvaluations(response.data);

        // Sum evalcredit_unit from all items in the array
        const totalEvalCreditUnits = response.data.reduce(
          (sum, evaluation) => sum + evaluation.evalcredit_unit,
          0
        );
        // Assuming faculty_id is present in the first item of the array
        if (response.data.length > 0) {
          setFacultyId(response.data[0].faculty_id);
          setRequiredUnits(response.data[0].requiredcredit_unit);
          setTotalEvalCreditUnits(totalEvalCreditUnits);
        } else {
          console.error("No evaluations found in the API response");
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setEvaluations([]);
      });
  }, [semester, studentNumber, year]);

  useEffect(() => {
    console.log("Faculty Id:", facultyId);
  }, [facultyId]);

  //fetch  faculty
  useEffect(() => {
    if (facultyId !== null) {
      axios
        .get(`${endPoint}/facultyId/${facultyId}`)
        .then((res) => {
          const facultyDetails = res.data;
          console.log("Faculty Details:", facultyDetails);
          setFacultyDetails(facultyDetails);
        })
        .catch((error) => {
          console.error("Error fetching faculty details:", error);
        })
        .finally(() => {
          console.log("Faculty API call done.");
        });
    }
  }, [facultyId]);

  // Update matchedCourses when curriculumData changes
  useEffect(() => {
    // Extracting course codes from evaluationData
    const evaluationCourseCodes = evaluations.map(
      (course) => course.course_reco
    );

    // Log values for debugging
    console.log("Evaluation Course Codes:", evaluationCourseCodes);
    console.log("Curriculum Data:", courses);

    // Filter curriculumData based on the matched course codes
    const matchedCourses = courses.filter((course) => {
      const courseCodeLowerCase = course.course_code.trim();
      const included = evaluationCourseCodes.includes(courseCodeLowerCase);
      console.log(
        `Checking ${courseCodeLowerCase} against ${evaluationCourseCodes.join(
          ", "
        )}: ${included ? "Matched" : "Not Matched"}`
      );
      return included;
    });

    // You can now use matchedCourses for further processing
    console.log("Matched Courses:", matchedCourses);
    setMatchedCourses(matchedCourses);
  }, [evaluations, courses]);

  useEffect(() => {
    console.log("Curriculum Data:", courses);
    console.log("Evaluation Data:", evaluations);
    console.log("MatchedCourses Data:", matchedCourses);
  }, [evaluations, matchedCourses, courses]);

  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return "";
  };

  const renderPrerequisites = (prerequisites) => {
    if (!prerequisites || !curriculumMap.size) return null;

    const prerequisiteList = prerequisites.split(",");

    return (
      <>
        {prerequisiteList.map((prerequisite, index) => {
          // Extracting the course code from the prerequisite (assuming format "course_code")
          const prerequisiteCode = prerequisite.trim();

          // Getting the corresponding course title from the curriculumMap
          const courseTitle = curriculumMap.get(prerequisiteCode);

          // Displaying the course title in the tooltip
          return (
            <Tooltip key={index} label={courseTitle} hasArrow>
              <div>{prerequisiteCode}</div>
            </Tooltip>
          );
        })}
      </>
    );
  };

  const filteredCourses = {
    "First First Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "First Semester"
    ),
    "First Second Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Second First Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "First Semester"
    ),
    "Second Second Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third First Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "First Semester"
    ),
    "Third Second Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third Summer Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth First Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "First Semester"
    ),
    "Fourth Second Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Second Semester"
    ),
  };
  if (
    (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) &&
    programId === 1 &&
    !(strand === "STEM" || strand === "ICT")
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", courses);
    filteredCourses["Bridging"] = courses.filter((courseItem) => {
      return (
        (courseItem.course_year === 0 &&
          courseItem.course_sem === "Bridging") ||
        courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }

  if (
    !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) &&
    programId === 1 &&
    strand !== "STEM" &&
    strand !== "ICT"
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", courses);
    filteredCourses["Bridging"] = courses.filter((courseItem) => {
      return (
        (courseItem.course_year === 0 &&
          courseItem.course_sem === "Bridging") ||
        courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }
  console.log("Courses by year and semester:", filteredCourses);

  const noEvaluations = Object.keys(filteredCourses).every(
    (key) => filteredCourses[key].length === 0
  );

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");

    // Set a specific width for the table
    if (table) {
      table.style.width = "100%"; // Set the table width to 100% to avoid overflow
    }

    html2pdf(element, {
      margin: 10,
      filename: "evaluation.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    });

    // Reset the table width after downloading the PDF
    if (table) {
      table.style.width = ""; // Reset to default width
    }
  };

  const getYearText = (year) => {
    switch (year) {
      case "1":
        return `${startYear}-${Number(startYear) + 1} - ${semester}`;
      case "2":
        return `${Number(startYear) + 1}-${
          Number(startYear) + 2
        } - ${semester}`;
      case "3":
        return `${Number(startYear) + 2}-${
          Number(startYear) + 3
        } - ${semester}`;
      case "4":
        return `${Number(startYear) + 3}-${
          Number(startYear) + 4
        } - ${semester}`;
      case 5:
        return `${Number(startYear) + 4}-${
          Number(startYear) + 5
        } - ${semester}`;
      case 6:
        return `${Number(startYear) + 5}-${
          Number(startYear) + 6
        } - ${semester}`;

      default:
        return "";
    }
  };
  console.log("getYearText", getYearText(year));

  console.log("noEvaluations:", noEvaluations);
  console.log("noEvaluations before return:", noEvaluations);

  const calculateSchoolYear = (year) => {
    let schoolYearStart = parseInt(studentNumber.substring(0, 4));
    let schoolYearEnd = schoolYearStart;

    switch (year) {
      case "1":
        schoolYearEnd += 1;
        break;
      case "2":
        schoolYearStart += 1;
        schoolYearEnd += 2;
        break;
      case "3":
        schoolYearStart += 2;
        schoolYearEnd += 3;
        break;
      case "4":
        schoolYearStart += 3;
        schoolYearEnd += 4;
        break;
      default:
        schoolYearEnd = schoolYearStart;
        break;
    }

    return `${schoolYearStart}-${schoolYearEnd}`;
  };

  //fetch validate
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from validateData endpoint
        const validateResponse = await axios.get(
          `${endPoint}/validateData?studentNumber=${studentNumber}`
        );

        const validateData = validateResponse.data || [];
        // const curriculumData = curriculumResponse.data || [];

        setValidatedCourse(validateData);

        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    // Call fetchData when the component mounts
    fetchData();
  }, [studentNumber]);

  useEffect(() => {
    // console.log("Validate Data:", validatedCourse);
  }, [validatedCourse]);

  useEffect(() => {
    let courseType = "";
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      courseType = 2019;
    } else {
      courseType = 2022;
    }

    setCourseType(courseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
      )
      .then((res) => {
        const combinedData = res.data;

        console.log("Curriculum Data:", combinedData);

        if (!Array.isArray(combinedData)) {
          console.error("Invalid data format. Expected an array.");
          return;
        }
        // Check if combinedData contains the expected properties
        if (combinedData.length > 0 && !("course_id" in combinedData[0])) {
          console.error("Invalid data format. Missing 'course_id' property.");
          return;
        }

        let totalCreditUnits = 0;
        combinedData.forEach((course) => {
          // console.log(
          //   `Credit Unit for ${course.course_id}: ${course.credit_unit}`
          // );
          if (
            !(
              programId === 1 &&
              (strand === "STEM" || strand === "ICT") &&
              course.course_sem === "Bridging"
            )
          ) {
            console.log(
              `Credit Unit for ${course.course_id}: ${course.credit_unit}`
            );
            totalCreditUnits += course.credit_unit;
          }
        });

        // Log the total credit units
        console.log("Total Credit Units:", totalCreditUnits);
        setTotalCreditUnits(totalCreditUnits);
        // Extract course_ids from combinedData
        const courseIds = combinedData.map((course) => course.course_id);

        // Filter the course_ids that exist in validatedCourse
        const matchingCourseIds = validatedCourse.filter((course) =>
          courseIds.includes(course.course_id)
        );

        // Log the matching course_ids
        console.log("Matching Course IDs:", matchingCourseIds);

        const creditUnitsMap = {};
        let totalValidatedCreditUnits = 0;
        matchingCourseIds.forEach((course) => {
          const matchingData = combinedData.find(
            (data) => data.course_id === course.course_id
          );
          creditUnitsMap[course.course_id] = matchingData.credit_unit;

          totalValidatedCreditUnits += matchingData.credit_unit;
        });

        console.log("Validated Total Credit Units:", totalValidatedCreditUnits);
        setValidatedTotalUnits(totalValidatedCreditUnits);

        // Log the credit units
        console.log("Credit Units:", creditUnitsMap);
        setCreditUnits(creditUnitsMap);
      })
      .catch((error) => {
        console.error("Error fetching curriculum data:", error.message);
      });
  }, [strand, programId, studentNumber, validatedCourse]);

  useEffect(() => {
    console.log("totalCreditUnits:", totalCreditUnits);
    console.log("validatedTotalUnits:", validatedTotalunits);

    const remainingCreditUnits = totalCreditUnits - validatedTotalunits;

    console.log("Remaining Credit Units:", remainingCreditUnits);
    setRemainingCreditUnits(remainingCreditUnits);
  }, [totalCreditUnits, validatedTotalunits]);

  useEffect(() => {
    console.log("Credit Units", creditUnits);
    console.log("Remaining Credit Units", remainingCreditUnits);
  }, [creditUnits, remainingCreditUnits]);

  return (
    <VStack
      justifyContent="center"
      alignItems="center"
      height="100%"
      position="relative"
    >
      <Box w="120%">
        <Navbar />
      </Box>

      <Center
        mr={year === "All Years" || semester === "All Semester" ? "28rem" : ""}
      >
        <VStack
          alignItems="center"
          justifyContent="center"
          mb="2rem"
          ml={evaluations != 0 ? "" : "28rem"}
        >
          <Text textAlign="center">
            {" "}
            Select Year and Semester of the Recommendation:
          </Text>

          <Box justifyContent="center">
            <HStack>
              <Select
                w="10rem"
                color="gray.500"
                placeholder="Year"
                onChange={(e) => setYear(e.target.value)}
              >
                {programAbr.startsWith("D") ? (
                  <>
                    <option value="1">
                      {startYear}-{Number(startYear) + 1}
                    </option>
                    <option value="2">
                      {Number(startYear) + 1}-{Number(startYear) + 2}
                    </option>
                    <option value="3">
                      {Number(startYear) + 2}-{Number(startYear) + 3}
                    </option>
                  </>
                ) : (
                  <>
                    <option value="1">
                      {startYear}-{Number(startYear) + 1}
                    </option>
                    <option value="2">
                      {Number(startYear) + 1}-{Number(startYear) + 2}
                    </option>
                    <option value="3">
                      {Number(startYear) + 2}-{Number(startYear) + 3}
                    </option>
                    <option value="4">
                      {Number(startYear) + 3}-{Number(startYear) + 4}
                    </option>
                    <option value="5">
                      {Number(startYear) + 4}-{Number(startYear) + 5}
                    </option>
                    <option value="6">
                      {Number(startYear) + 5}-{Number(startYear) + 6}
                    </option>
                  </>
                )}
                <option value="All Years">All Years</option>
              </Select>
              <Select
                w="25rem"
                color="gray.500"
                width="10rem"
                placeholder="Semester"
                onChange={(e) => setSemester(e.target.value)}
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
                <option value="Summer Semester">Summer Semester</option>
                <option value="All Semester">All Semester</option>
              </Select>
            </HStack>
          </Box>
        </VStack>
      </Center>

      {year !== "All Years" && semester !== "All Semester" ? (
        <VStack mb="0" w="100%" justifyContent="center">
          {evaluations.length !== 0 && (
            <Button
              style={{
                backgroundColor: "#740202",
                justifyContent: "flex-end",
                marginLeft: "50rem",
                color: "white",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onClick={handleDownloadPDF}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#950303";
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#740202";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              Download Recommended Courses
            </Button>
          )}
          <div ref={containerRef}>
            <VStack
              ml={evaluations != 0 ? "13rem" : "10rem"}
              align="flex-start"
            >
              <HStack justify="flex-start">
                <Text fontSize="17.5px" fontWeight="semibold">
                  Student Name:
                </Text>
                <Text>
                  {capitalizeWords(fname)} {capitalizeWords(mname)}{" "}
                  {capitalizeWords(lname)}
                </Text>
                <Text>({studentNumber})</Text>
              </HStack>
              <HStack mb="2rem">
                <Text fontWeight="semibold" fontSize="17.5px">
                  Recommendation for:
                </Text>
                <Text> {getYearText(year)} </Text>
              </HStack>
            </VStack>
            <VStack>
              {console.log("Rendering table:", !noEvaluations)}
              {evaluations.length === 0 ? (
                <VStack
                  ml={evaluations.length !== 0 ? "" : "20rem"}
                  height="100%"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Box justifyContent="center" width="80%" height="50%">
                    <Lottie
                      loop
                      animationData={NoEval}
                      play
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: NoEval,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid meet",
                          scale: 1,
                        },
                      }}
                    />
                  </Box>
                </VStack>
              ) : (
                <div>
                  {Object.keys(filteredCourses).map((key) => {
                    const [courseYear, courseSemester] = key.split(" ");
                    const coursesByYearAndSemester = filteredCourses[key];
                    // Filter evaluations for this specific year and semester
                    const matchingEvaluations = evaluations.filter(
                      (evaluationItem) =>
                        coursesByYearAndSemester.some(
                          (courseItem) =>
                            evaluationItem.course_reco ===
                            courseItem.course_code
                        )
                    );

                    if (
                      !coursesByYearAndSemester ||
                      coursesByYearAndSemester.length === 0 ||
                      matchingEvaluations.length === 0
                    ) {
                      return null; // Skip rendering if no courses or no matching evaluations
                    }
                    // Initialize variables for calculating totals for each table
                    let totalLectureHours = 0;
                    let totalLabHours = 0;
                    let totalCourseCredits = 0;

                    return (
                      <Wrap mx="auto" spacing="3" w="70%" key={key}>
                        <VStack mt="2rem" spacing="1" align="flex-start">
                          <HStack>
                            <Text fontSize="17.5px" fontWeight="semibold">
                              Year Level:
                            </Text>
                            <Text w="10rem" fontWeight="md" fontSize="17.5px">
                              {key === "Bridging" ? "" : `${courseYear} Year `}
                            </Text>
                          </HStack>

                          <HStack
                            spacing="20rem"
                            justifyContent="space-between"
                          >
                            <HStack>
                              <Text fontSize="17.5px" fontWeight="semibold">
                                Semester:
                              </Text>
                              <Text w="20rem" fontWeight="md" fontSize="17.5px">
                                {key === "Bridging"
                                  ? key
                                  : `${capitalizeWords(
                                      courseSemester
                                    )} Semester `}
                              </Text>
                            </HStack>
                            <HStack>
                              <Text fontSize="17.5px" fontWeight="semibold">
                                School Year:
                              </Text>
                              <Text>{calculateSchoolYear(year)}</Text>
                            </HStack>
                          </HStack>
                        </VStack>

                        <TableContainer overflowX="auto" w="100%" mt="1rem">
                          <Table
                            variant="simple"
                            fontFamily="inter"
                            size="sm"
                            style={{ minWidth: "800px" }}
                          >
                            <Thead bg="palette.primary" h="5rem">
                              <Tr>
                                <Th
                                  fontSize="10px"
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Course Code
                                </Th>
                                <Th
                                  fontSize="10px"
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Course Title
                                </Th>
                                <Th
                                  fontSize="10px"
                                  w="1rem"
                                  color="palette.secondary"
                                >
                                  Pre-Requisite(s)
                                </Th>
                                <Th
                                  style={{ textAlign: "center" }}
                                  fontSize="10px"
                                  color="palette.secondary"
                                >
                                  <div>Lecture</div>
                                  <div>Hours</div>
                                </Th>
                                <Th
                                  fontSize="10px"
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  <div>Lab</div>
                                  <div>Hours</div>
                                </Th>
                                <Th
                                  fontSize="10px"
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  <div>Course</div>
                                  <div>Credit</div>
                                </Th>
                                <Th
                                  fontSize="10px"
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  <div>Date</div>
                                  <div>Evaluated</div>
                                </Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {coursesByYearAndSemester.map((courseItem) => {
                                const matchingEvaluation = evaluations.find(
                                  (evaluationItem) =>
                                    evaluationItem.course_reco ===
                                    courseItem.course_code
                                );

                                if (!matchingEvaluation) {
                                  // Skip rendering if there's no matching evaluation
                                  return null;
                                }
                                // Calculate totals
                                totalLectureHours += courseItem.num_lecture;
                                totalLabHours += courseItem.num_lab;
                                totalCourseCredits += courseItem.credit_unit;

                                return (
                                  <Tr key={courseItem.course_code}>
                                    <Td>{courseItem.course_code}</Td>
                                    <Td
                                      className="course-title-cell"
                                      fontSize="12px"
                                      fontStyle="bitter"
                                    >
                                      {courseItem.course_title}
                                    </Td>
                                    <Td
                                      fontSize="14px"
                                      fontStyle="bitter"
                                      style={{
                                        textAlign: "center",
                                        lineHeight: "1.4",
                                      }}
                                    >
                                      {renderPrerequisites(
                                        courseItem.pre_requisite
                                      )}
                                    </Td>
                                    <Td
                                      fontSize="14px"
                                      fontStyle="bitter"
                                      style={{ textAlign: "center" }}
                                    >
                                      {courseItem.num_lecture}
                                    </Td>
                                    <Td
                                      fontSize="14px"
                                      fontStyle="bitter"
                                      style={{ textAlign: "center" }}
                                    >
                                      {courseItem.num_lab}
                                    </Td>
                                    <Td
                                      fontSize="14px"
                                      fontStyle="bitter"
                                      style={{ textAlign: "center" }}
                                    >
                                      {courseItem.credit_unit}
                                    </Td>
                                    <Td>
                                      {" "}
                                      {evaluations.length > 0 &&
                                        new Date(
                                          evaluations[0].date_eval
                                        ).toLocaleDateString()}
                                    </Td>
                                  </Tr>
                                );
                              })}
                            </Tbody>
                            <Tfoot
                              h="2.5rem"
                              bgColor="#F0EEED"
                              colSpan="9"
                              textAlign="center"
                            >
                              <Tr>
                                <Th></Th>
                                <Th
                                  fontSize="13px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  Total
                                </Th>
                                <Th></Th>
                                <Th
                                  fontSize="13px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {totalLectureHours}
                                </Th>
                                <Th
                                  fontSize="13px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {totalLabHours}
                                </Th>
                                <Th
                                  fontSize="13px"
                                  fontStyle="bitter"
                                  style={{ textAlign: "center" }}
                                >
                                  {totalCourseCredits}
                                </Th>
                                <Th></Th>
                              </Tr>
                            </Tfoot>
                          </Table>
                        </TableContainer>
                      </Wrap>
                    );
                  })}
                </div>
              )}
              {/* start from lottie */}
            </VStack>
            {evaluations.length !== 0 && (
              <Box ml="13rem" mt="5rem">
                <HStack>
                  <Text fontWeight="bold" fontSize="18px">
                    Evaluated by:
                  </Text>
                  <Text ml="3rem" fontWeight="semibold" fontSize="20px">
                    {facultyDetails &&
                      `${facultyDetails.faculty_fname} ${facultyDetails.faculty_mname} ${facultyDetails.faculty_lname}`}
                  </Text>
                </HStack>

                <HStack mt="3rem">
                  <Text fontSize="18px" fontWeight="bold">
                    Total Credit Units Recommended:
                  </Text>
                  <Text ml="2rem" fontWeight="semibold" fontSize="18px">
                    {totalEvalCreditUnits} unit(s)
                  </Text>
                </HStack>
                <HStack mt="8px">
                  <Text fontSize="18px" fontWeight="bold">
                    {" "}
                    Total Credit Units:
                  </Text>
                  <Text ml="10.2rem" fontWeight="semibold" fontSize="18px">
                    {totalCreditUnits}
                    {""} unit(s)
                  </Text>
                </HStack>
                <HStack mt="8px">
                  <Text fontSize="18px" fontWeight="bold">
                    Taken Credit Units:
                  </Text>
                  <Text ml="9.6rem" fontWeight="semibold" fontSize="18px">
                    {validatedTotalunits} {""} unit(s)
                  </Text>
                </HStack>
                <HStack mt="8px">
                  <Text fontSize="18px" fontWeight="bold">
                    Remaining Credit Units:
                  </Text>
                  <Text ml="7rem" fontWeight="semibold" fontSize="18px">
                    {remainingCreditUnits} unit(s)
                  </Text>
                </HStack>
                <HStack mt="8px">
                  <Text fontSize="18px" fontWeight="bold">
                    Remaining Semester(s):
                  </Text>
                  <Text ml="7rem" fontWeight="semibold" fontSize="18px">
                    {" "}
                    {Math.ceil(remainingCreditUnits / 23)} semester(s)
                  </Text>
                </HStack>
                <HStack mt="8px">
                  <Text fontSize="18px" fontWeight="bold">
                    Remaining Year(s):
                  </Text>
                  <Text ml="10rem" fontWeight="semibold" fontSize="18px">
                    {" "}
                    {Math.ceil(Math.ceil(remainingCreditUnits / 23) / 2)}{" "}
                    year(s)
                  </Text>
                </HStack>
              </Box>
            )}
          </div>
        </VStack>
      ) : (
        <Flex padding="2rem">
          <EvaluationAll
            studentNumber={studentNumber}
            totalCreditUnits={totalCreditUnits}
            validatedTotalUnits={validatedTotalunits}
            remainingCreditUnits={remainingCreditUnits}
          />
        </Flex>
      )}
    </VStack>
  );
}

export default Evaluation;
