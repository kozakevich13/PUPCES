import {
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spacer,
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
  useToast,
  Box,
} from "@chakra-ui/react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Footer from "../../../components/footer/footer";
import Navbar from "../../../components/navbar/navbar";
import breakPoints from "../../../utils/breakpoint";
import { endPoint } from "../../config";
import SpecialGradeModal from "./SpecialGradeModal";
import "./curriculum.css";

function Curriculum() {
  const studentNumber = Cookies.get("student_number");
  const program = Cookies.get("program_id");
  const strand = Cookies.get("strand");
  console.log("(Curriculum)Program in cookie:", program);
  console.log("(Curriculum)Strand in cookie:", strand);
  console.log("(Curriculum)studentnumber in cookie:", studentNumber);
  const [searchQuery, setSearchQuery] = useState("");
  const [foundCourseIndex, setFoundCourseIndex] = useState(-1);
  const scrollRef = useRef(null);
  const [curriculumMap, setCurriculumMap] = useState(new Map());
  const [programId, setProgramId] = useState();
  const [programName, setProgramName] = useState("");
  const [courseType, setCourseType] = useState();
  const [studentData, setStudentData] = useState({});
  const [grades] = useState([]);
  const [course, setCourse] = useState([]);
  const [selectedGrades, setSelectedGrades] = useState({});
  const [totalLectureHours, setTotalLectureHours] = useState(0);
  const [totalLabHours, setTotalLabHours] = useState(0);
  const [totalCourseCredits, setTotalCourseCredits] = useState(0);
  const [disabledRows, setDisabledRows] = useState({});
  const [remarks, setRemarks] = useState({});
  const [editable, setEditable] = useState({});
  const [selectedRemarks, setSelectedRemarks] = useState({});
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const toast = useToast();
  const [prerequisites, setPrerequisites] = useState({});
  const [prerequisiteCourses, setPrerequisiteCourses] = useState([]);
  const [submitClicked, setSubmitClicked] = useState(false);
  const [isGradeSubmitted, setIsGradeSubmitted] = useState(false);
  const [isCourseSubmitted, setIsCourseSubmitted] = useState(false);
  const [gradeSubmittedStatus, setGradeSubmittedStatus] = useState({});
  const [gradesSubmitted, setGradesSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [specialGradeSubmitted, setSpecialGradeSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [modalData, setModalData] = useState({
    courseCode: "",
    currentGrade: "",
    courseId: "", // Add other needed data
    studentNumber: "",
    remakrs: "",
  });

  const containerRef = useRef(null);

  const handleDownloadPDF = () => {
    const element = containerRef.current;
    const table = element.querySelector("table");
    console.log("Container reference:", element);
    console.log("HTML content before conversion:", element.innerHTML);

    // Set a specific width for the table
    if (table) {
      table.style.width = "100%";
    }

    html2pdf(element, {
      margin: 10,
      filename: "Curriculum.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "legal",
        orientation: "landscape",
      },
    }).then(() => {
      if (table) {
        table.style.width = ""; // Reset to default width
      }
    });
  };

  //fetch student
  useEffect(() => {
    console.log("Fetching student data...");

    async function fetchStudentData() {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        const studentData = response.data;
        setStudentData(studentData);
        setProgramId(studentData.program_id);
        console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();
    console.log("Fetching student data complete.");
  }, [studentNumber]);

  //fetch program
  useEffect(() => {
    const fetchProgramName = async () => {
      try {
        if (programId) {
          const response = await fetch(`${endPoint}/programs`);
          if (!response.ok) {
            throw new Error("Failed to fetch program_name");
          }

          const data = await response.json();
          console.log("All programs:", data);

          // Assuming the data is an array and you want to find the matching program_name
          const matchedProgram = data.find(
            (programItem) => programItem.program_id === +programId
          );

          console.log("Matched program:", matchedProgram);

          if (matchedProgram) {
            setProgramName(matchedProgram.program_name);
            console.log(matchedProgram.program_name);
          } else {
            // Handle case where the program_id doesn't match any program
            setProgramName("Unknown Program");
          }
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
        // Handle error (e.g., set a default program_name)
        setProgramName("Unknown Program");
      }
    };

    fetchProgramName();
  }, [programId]);

  const handleSpecialGradeButtonClick = (courseItem) => {
    // Set data and open the modal
    setModalData({
      courseCode: courseItem.course_code,
      currentGrade: selectedGrades[courseItem.course_code] || "",
      courseId: courseItem.course_id, // Add other needed data
      studentNumber: studentData.student_number,
      remarks: courseItem.remaks,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
  };

  const calculateGPA = (totalGrades, countCoursesWithGrades) => {
    const gpa =
      countCoursesWithGrades > 0 ? totalGrades / countCoursesWithGrades : 0;
    return gpa.toFixed(2);
  };
  //fetch curriculum
  useEffect(() => {
    //  console.log("Fetching course data...");

    let courseType = "";
    if (
      studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019")
    ) {
      courseType = 2019;
    } else {
      courseType = 2022;
    }

    setCourseType(courseType);
    console.log("Course Type in Curriculum:", courseType);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
      )
      .then((res) => {
        const courseData = res.data;
        console.log("API Response Data:", courseData);

        // Now you can use the curriculumStore to get course_code and course_title
        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);

        // Extract prerequisite course codes from the curriculum data
        const prerequisiteCourseCodes = courseData
          .filter(
            (course) =>
              course.pre_requisite && course.pre_requisite.trim() !== ""
          )
          .map((course) => course.pre_requisite.trim());

        setPrerequisiteCourses(prerequisiteCourseCodes);
        // Console.log the prerequisite course codes
        //  console.log("Prerequisite Courses:", prerequisiteCourseCodes);
        // Filter courses that have grades
        const coursesWithGrades = courseData.filter(
          (courseItem) => selectedGrades[courseItem.course_code] !== undefined
        );

        // Create a map of disabled courses based on the fetched grades
        const disabledCourses = {};
        coursesWithGrades.forEach((courseItem) => {
          const { course_code } = courseItem;
          disabledCourses[course_code] = true;
        });

        // Update the editable state based on the disabled courses
        setEditable((prevEditable) => {
          const updatedEditable = { ...prevEditable };
          Object.keys(updatedEditable).forEach((courseCode) => {
            updatedEditable[courseCode] = !disabledCourses[courseCode];
          });
          return updatedEditable;
        });

        setCourse(courseData);
        setTotalLectureHours(totalLectureHours);
        setTotalLabHours(totalLabHours);
        setTotalCourseCredits(totalCourseCredits);
      })
      .catch((err) => {
        console.error("Error fetching course data:", err);
      })
      .finally(() => {
        console.log("API call done.");
      });
  }, [
    totalCourseCredits,
    totalLabHours,
    totalLectureHours,
    selectedGrades,
    studentNumber,
    program,
    strand,
    programId,
  ]);

  //fetch grades
  const fetchGradesData = async () => {
    try {
      console.log("CourseType:", courseType);
      console.log("Fetching grades data...");

      const response = await axios.get(
        `${endPoint}/grades?studentNumber=${studentNumber}`
      );

      console.log("Response Status:", response.status);
      console.log("Response Data:", response.data);

      if (response.status === 200) {
        const gradesData = response.data;

        // Debug log to inspect the gradesData received from the API
        console.log("Received gradesData:", gradesData);

        const curriculumResponse = await axios.get(
          `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
        );
        console.log("Fetched curriculum data:", curriculumResponse.data);

        const courseCodeMap = {};
        curriculumResponse.data.forEach((course) => {
          courseCodeMap[course.course_id] = course.course_code;
        });
        console.log("Course Code Map:", courseCodeMap);

        const selectedGrades = {};
        const remarks = {};
        const initialEditable = {};
        const prereqsWithGrades = {};

        // Process prerequisites
        const newPrerequisites = {};

        gradesData.forEach((gradeData) => {
          const { course_id, prerequisites: coursePrerequisites } = gradeData;
          const course_code = courseCodeMap[course_id];

          // console.log(
          //   `Prerequisites for course ${course_code}:`,
          //   coursePrerequisites
          // );

          // If prerequisites are not defined or not a string, set it to an empty string
          const prerequisitesString =
            typeof coursePrerequisites === "string" ? coursePrerequisites : "";

          // Split the string into an array and remove any empty strings
          const prerequisitesArray = prerequisitesString
            .split(",")
            .map((prerequisite) => prerequisite.trim())
            .filter(Boolean);

          // console.log(
          //   `Prerequisites Array for course ${course_code}:`,
          //   prerequisitesArray
          // );

          // Initialize the prerequisites status for the current course
          newPrerequisites[course_code] = true;

          // Check prerequisites for each course
          if (coursePrerequisites) {
            const prerequisitesArray = coursePrerequisites
              .split(",")
              .flatMap((prerequisite) => prerequisite.split(" "))
              .map((p) => p.trim());

            // console.log(
            //   `Checking prerequisites for course ${course_code}:`,
            //   prerequisitesArray
            // );

            // Check each prerequisite
            for (const prerequisite of prerequisitesArray) {
              const hasGrade = selectedGrades[prerequisite] !== undefined;

              // console.log(
              //   `Prerequisite ${prerequisite} has grade: ${hasGrade}, Grade: ${selectedGrades[prerequisite]}`
              // );

              // If any prerequisite is missing a grade, set the status to false
              if (!hasGrade) {
                // console.log(
                //   `Setting ${course_code} prerequisites status to false due to missing grade for ${prerequisite}.`
                // );
                newPrerequisites[course_code] = false;
                break; // No need to check further, set to false and break the loop
              }
            }

            console.table({ [course_code]: newPrerequisites[course_code] });
          }
        });

        // console.log("Final Prerequisites Status:", newPrerequisites);

        // Set the state for prerequisites
        setPrerequisites(newPrerequisites);

        const gradeStatusUpdates = [];
        // Process the grades data
        for (const gradeData of gradesData) {
          const {
            course_id,
            grades,
            remarks: gradeRemarks,
            editable: gradeEditable,
            prerequisites: coursePrerequisites,
          } = gradeData;
          const course_code = courseCodeMap[course_id];

          const isGradeValid = ![5, -1, 0].includes(parseFloat(grades));

          // If the grade is valid, collect the status update
          if (isGradeValid) {
            gradeStatusUpdates.push({
              course_code,
              status: true,
            });
          }
          // console.log("After state update");
          // Debug log to check individual gradeData
          // console.log(
          //   `Processing gradeData for course ${course_code}:`,
          //   gradeData
          // );

          selectedGrades[course_code] = parseFloat(grades);
          remarks[course_code] = gradeRemarks;

          initialEditable[course_code] = gradeEditable === 0 ? false : true;

          // Check prerequisites for each course
          if (coursePrerequisites) {
            prereqsWithGrades[course_code] = coursePrerequisites.every(
              (prerequisite) => selectedGrades[prerequisite] !== undefined
            );
          }
        }

        for (const update of gradeStatusUpdates) {
          await setGradeSubmittedStatus((prevStatus) => ({
            ...prevStatus,
            [update.course_code]: update.status,
          }));
        }

        // Debug logs to check the processed data
        // console.log("Selected Grades:", selectedGrades);
        // console.log("Remarks:", remarks);
        // console.log("Initial Editable:", initialEditable);

        //console.log("Prerequisites with Grades:", newPrerequisites);

        // Set the states based on the processed data
        setSelectedGrades(selectedGrades);
        setRemarks(remarks);
        setEditable(initialEditable);
        setPrerequisites(prereqsWithGrades);

        // debug log to confirm that the grades data has been fetched
        console.log("Grades data fetched successfully.");
      } else {
        console.error(
          "Error fetching grades data. Response status:",
          response.status
        );
      }
    } catch (error) {
      console.error("Error fetching grades data:", error);
    } finally {
      setLoading(true);
    }
  };

  useEffect(() => {
    // Fetch grades data when the page reloads
    fetchGradesData();
  }, [courseType, program, programId, studentNumber]);

  const handleGradesSaved = () => {
    fetchGradesData();
  };
  useEffect(() => {
    setLoading(false);
    console.log("Grades data fetched successfully.");
  }, [gradeSubmittedStatus]);

  useEffect(() => {
    console.log("Editable state updated:", editable);
  }, [editable]);

  // Function to capitalize the first letter of each word
  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return ""; // Return an empty string if the input is undefined
  };

  // Filter course data based on course_year and course_sem
  const filteredCourses = {
    "First First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "First Semester"
    ),
    "First Summer Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "First Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Second First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "First Semester"
    ),
    "Second Summer Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Second Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "First Semester"
    ),
    "Third Second Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Second Semester"
    ),
    "Third Summer Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 3 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth First Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "First Semester"
    ),
    "Fourth Summer Semester": course.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth Second Semester": course.filter(
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
    console.log("All Courses:", course);
    filteredCourses["Bridging"] = course.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log("Bridging Semester Courses:", filteredCourses["Bridging "]);
  }

  if (
    !(studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) &&
    programId === 1 &&
    strand !== "STEM" &&
    strand !== "ICT"
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", course);
    filteredCourses["Bridging"] = course.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }

  const allCourses = [];

  Object.keys(filteredCourses).forEach((key) => {
    const coursesForTable = filteredCourses[key];

    const [courseYear, courseSemester] = key.split(" ");
    let originalSchoolYearStart = parseInt(studentNumber.substring(0, 4));
    let schoolYearStart = originalSchoolYearStart;
    let schoolYearEnd;

    console.log(" schoolYearStart + 1", schoolYearStart + 1);

    switch (parseInt(courseYear)) {
      case 1:
        schoolYearEnd = schoolYearStart + 1;
        break;
      case 2:
        schoolYearEnd = schoolYearStart + 2;
        break;
      case 3:
        schoolYearEnd = schoolYearStart + 3;
        break;
      case 4:
        schoolYearEnd = schoolYearStart + 4;
        break;
      default:
        schoolYearEnd = schoolYearStart;
    }

    if (courseYear === "First") {
      schoolYearEnd += 1;
    } else if (courseYear === "Second") {
      schoolYearStart += 1;
      schoolYearEnd += 2;
    } else if (courseYear === "Third") {
      schoolYearStart += 2;
      schoolYearEnd += 3;
    } else if (courseYear === "Fourth") {
      schoolYearStart += 3;
      schoolYearEnd += 4;
    } else {
      schoolYearEnd = schoolYearStart + 5;
    }

    console.log("Key:", courseYear);
    console.log("Original School Year Start:", originalSchoolYearStart);

    console.log("Student NUmber substring:", originalSchoolYearStart);
    console.log("Debug - schoolYearStart:", schoolYearStart);
    console.log("Debug - schoolYearEnd:", schoolYearEnd);

    const schoolYear = `${schoolYearStart}-${schoolYearEnd}`;
    console.log("School Year", schoolYear);

    const coursesWithPrerequisites = [];
    const coursesWithoutPrerequisites = [];

    coursesForTable.forEach((courseItem) => {
      const courseGrades = grades.filter(
        (grade) => grade.course_code === courseItem.course_code
      );

      if (courseGrades.length === 0) {
        coursesWithoutPrerequisites.push(courseItem);
      } else {
        coursesWithPrerequisites.push(courseItem);
      }
    });

    const sortedCourses = coursesWithPrerequisites.concat(
      coursesWithoutPrerequisites
    );

    if (sortedCourses.length > 0) {
      allCourses.push({
        key,
        courseYear,
        courseSemester,
        schoolYear,
        courses: sortedCourses,
      });
    }
  });

  // console.log("allCourses after pushing:", allCourses);

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

  useEffect(() => {
    //   console.log("isCourseSubmitted has been updated:", isCourseSubmitted);
  }, [isCourseSubmitted]);

  //HANDLESUBMITTT
  const handleSubmit = async (tableIdentifier) => {
    console.log("Before POST request");
    console.log("Selected Grades:", selectedGrades);
    console.log("Disabled Rows:", disabledRows);
    console.log("Editable state:", editable);
    setSubmitClicked(true);
    console.log("Before isCourseSubmitted update:", isCourseSubmitted);
    setIsCourseSubmitted(true);
    console.log("After isCourseSubmitted update:", isCourseSubmitted);

    console.log("Table Identifier:", tableIdentifier);

    const table = allCourses.find((courseGroup) => {
      return courseGroup.key === tableIdentifier;
    });

    console.log("Selected Table:", table);

    if (!table) {
      console.error(
        "Table not found for the provided identifier:",
        tableIdentifier
      );
      return;
    }

    console.log("Table's Courses:", table.courses);

    const coursesToSubmit = table.courses.filter((courseItem) => {
      return (
        courseItem.course_year === table.courseYear &&
        courseItem.course_sem === table.courseSemester
      );
    });
    const curriculumResponse = await axios.get(
      `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
    );
    console.log("Fetched curriculum data:", curriculumResponse.data);

    const courseCodeMap = {};
    curriculumResponse.data.forEach((course) => {
      courseCodeMap[course.course_id] = course.course_code;
    });

    //console.log("Courses to Submit:", coursesToSubmit);

    // // array to store courses with grades to submit
    // const coursesToSubmit = [];

    const mapGradeToRemarks = (grade) => {
      if (grade === "Incomplete" || grade === "Withdraw") {
        return grade;
      } else {
        return grade >= 1.0 && grade <= 3.0 ? "P" : "F";
      }
    };
    let specialGradeProcessed = false;
    let specialCourseCode;
    for (const courseItem of table.courses) {
      // specialGradeProcessed = false;
      console.log("CourseItem:", courseItem);
      console.log("Course Year:", courseItem.courseYear);
      console.log("Course Semester:", courseItem.courseSemester);
      console.log(
        "Before processing, specialGradeProcessed:",
        specialGradeProcessed
      );

      const courseCode = courseCodeMap[courseItem.course_id];

      // Check if the course is not disabled and has a grade selected
      if (
        editable[courseCode] !== false &&
        selectedGrades[courseCode] !== undefined
      ) {
        // Allow the select button for grades 5, -1, and 0
        if (
          selectedGrades[courseCode] === 5 ||
          selectedGrades[courseCode] === -1 ||
          selectedGrades[courseCode] === 0 ||
          selectedGrades[courseCode] === "Incomplete" ||
          selectedGrades[courseCode] === "Withdraw"
        ) {
          console.log(`Processing special grade for course: ${courseCode}`);
          if (specialGradeProcessed) {
            // Allow updating the grade
            try {
              const grade = selectedGrades[courseCode];

              console.log("Updating grade for course:", courseCode);
              console.log("New Grade to submit:", grade);

              // Add logic to update the grade in the database
              await axios.put(`${endPoint}/update-grades`, {
                studentNumber: studentNumber,
                course_id: courseItem.course_id,
                grades: parseFloat(grade),
                remarks: mapGradeToRemarks(grade),
              });

              console.log(
                `Grade updated successfully for course: ${courseCode}`
              );

              continue;
            } catch (error) {
              console.error("Error updating grades:", error);
            }
          } else {
            // Continue with processing or submitting for these special grades
            try {
              const grade = selectedGrades[courseCode];

              console.log("Submitting grade for course:", courseCode);
              console.log("Grade to submit:", grade);

              const response = await axios.post(`${endPoint}/grades`, {
                student_number: studentNumber,
                course_id: courseItem.course_id,
                grades: parseFloat(grade),
                remarks: mapGradeToRemarks(grade),
              });

              console.log(
                `Grade submitted successfully for course: ${courseCode}`
              );
              setGradesSubmitted((prevGradesSubmitted) => ({
                ...prevGradesSubmitted,
                [courseCode]: true,
              }));
              console.log("PUT request successful", response.data);

              specialGradeProcessed = true;
              specialCourseCode = courseItem.course_code;
              continue;
            } catch (error) {
              console.error("Error updating grades:", error);
            }
          }
        } else {
          coursesToSubmit.push(courseItem);
        }

        // const grade = selectedGrades[courseCode];
      }

      console.log(
        "After processing, specialGradeProcessed:",
        specialGradeProcessed
      );
    }
    console.log("Outside loop, specialGradeProcessed:", specialGradeProcessed);
    console.log("Before toast block");
    console.log("coursesToSubmit length:", coursesToSubmit.length);
    console.log("specialGradeProcessed:", specialGradeProcessed);

    if (coursesToSubmit.length === 0 && !specialGradeProcessed) {
      console.log("Inside toast block");
      toast({
        title: "No Grades to Submit",
        description: "Please select grades for one or more courses.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    } else if (specialGradeProcessed) {
      setSpecialGradeSubmitted(true);
      console.log("Inside special grade toast block");
      toast({
        title: "Grade Submitted",
        description: `Grade submitted successfully for ${specialCourseCode}, but you may need to retake the course.`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }

    console.log("After toast block");
    // Check if there are no selected grades
    const hasSelectedGrades = Object.keys(selectedGrades).some(
      (courseCode) => selectedGrades[courseCode] !== undefined
    );
    // Check if there are no selected grades
    // const hasSelectedGrades = coursesToSubmit.some(
    //   (courseItem) => selectedGrades[courseItem.course_code] !== undefined
    // );

    if (!hasSelectedGrades) {
      console.log("No non-disabled grades to submit");
      toast({
        title: "Select a Grade",
        description: "Please select a grade before submitting.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    const nonDisabledGrades = {};
    // Check if there are no selected grades
    for (const courseItem of course) {
      const courseCode = courseCodeMap[courseItem.course_id];
      console.log(`Course: ${courseCode}`);
      console.log(`editable[${courseCode}]: ${editable[courseCode]}`);

      if (selectedGrades[courseCode] !== undefined) {
        let grade = selectedGrades[courseCode];

        // Check for special cases and map to -1 or 0
        if (grade === "Incomplete") {
          grade = -1;
        } else if (grade === "Withdraw") {
          grade = 0;
        }

        nonDisabledGrades[courseCode] = grade;
      }
    }

    // Check if there are no non-disabled grades
    if (Object.keys(nonDisabledGrades).length === 0) {
      console.log("No non-disabled grades to submit");
      toast({
        title: "No Grades to Submit",
        description: "All selected grades are already disabled.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });

      return;
    }

    const updatedDisabledRows = { ...disabledRows }; // Create a copy of disabledRows

    for (const courseItem of coursesToSubmit) {
      const curriculumResponse = await axios.get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
      );
      console.log("Fetched curriculum data grade:", curriculumResponse.data);

      const courseCodeMap = {};
      curriculumResponse.data.forEach((course) => {
        console.log("Course in curriculum:", course); // Log the entire course object
        // Assuming course_id is the correct property, update this line accordingly
        courseCodeMap[course.course_id] = course.course_code;
      });

      console.log("Coursecode map", courseCodeMap[courseItem.course_id]);
      const courseCode = courseCodeMap[courseItem.course_id];
      // Skip rows that are already disabled
      if (updatedDisabledRows[courseCode]) {
        continue;
      }

      const grade = nonDisabledGrades[courseCode];

      if (grade !== undefined) {
        // Function to map grade to remarks
        const mapGradeToRemarks = (grade) => {
          if (grade === "Incomplete" || grade === "Withdraw") {
            return grade;
          } else {
            return grade >= 1.0 && grade <= 3.0 ? "P" : "F";
          }
        };

        // Disable the row after selecting a grade
        updatedDisabledRows[courseCode] = true;

        try {
          const courseId = courseCodeMap[courseItem.course_id];
          console.log("Submitting grade for course:", courseId);
          console.log("Grade to submit:", grade);

          console.log("Axios Request Data:", {
            student_number: studentNumber,
            course_id: courseItem.course_id,
            grades: parseFloat(grade),
            remarks: mapGradeToRemarks(grade),
          });

          await axios.post(`${endPoint}/grades`, {
            student_number: studentNumber,
            course_id: courseItem.course_id,
            grades: parseFloat(grade),
            remarks: mapGradeToRemarks(grade),
          });
          console.log(
            `Grade submitted successfully for course: ${courseItem.course_code}`
          );

          //  a success toast for each course updated
          toast({
            title: "Grades Submitted",
            description: "Grades have been submitted successfully.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          console.log("After setDisabledRows:", disabledRows);

          // Update the editable state for this course to false
          console.log("Before setEditable:", editable);
          // Update the editable state for this course to false

          console.log("After setEditable:", editable);

          // await updateRemainingUnits(course);
          // Disable the row after selecting a grade
          updatedDisabledRows[courseItem.course_code] = true;

          setEditable((prevEditable) => ({
            ...prevEditable,
            [courseCode]: false,
          }));
        } catch (error) {
          // Handle any error that may occur during the API call
          console.error("Error updating grades:", error);
          console.error("Axios Request Data:", {
            student_number: studentNumber,
            course_id: courseItem.course_id,
            grades: parseFloat(grade),
            remarks: mapGradeToRemarks(grade),
          });
          console.error("Axios Response Data:", error.response.data);
          console.error("Axios Response Headers:", error.response.headers);

          // Extract server error message if available
          // const serverErrorMessage =
          //   error.response && error.response.data
          //     ? error.response.data.message
          //     : "An error occurred while updating grades.";

          // Show an error toast
          // toast({
          //   title: "Error",
          //   description: serverErrorMessage,
          //   status: "error",
          //   duration: 3000,
          //   isClosable: true,
          // });

          // Log additional error details
          console.error("API Request Error:", error);

          // Log the server response data (if available)
          if (error.response) {
            console.error("Server Response Data:", error.response.data);
          }
        }
      }
    }

    // Update the disabledRows state to disable rows after submitting
    setDisabledRows(updatedDisabledRows);

    await setIsGradeSubmitted(true);

    // Update the gradeSubmittedStatus based on the selectedGrades
    setGradeSubmittedStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      for (const courseCode of coursesToSubmit.map(
        (courseItem) => courseItem.course_code
      )) {
        updatedStatus[courseCode] = true;
      }
      return updatedStatus;
    });
    // debug log to confirm that the POST request was successful
    console.log("POST request successful");

    //  debug log after the POST request
    console.log("After POST request");
  };

  function gradesForZeroOrMinusOne(courseCode) {
    const grade = selectedGrades[courseCode];
    if (grade === 0) {
      return "Withdraw";
    } else if (grade === -1) {
      return "Incomplete";
    } else {
      return "Grades";
    }
  }

  const isSelectDisabled = (courseCode, prerequisites) => {
    //console.log("Initial disabledRows:", disabledRows);
    //console.log("Initial submitClicked:", submitClicked);

    const isCourseSubmitted =
      disabledRows[courseCode] !== undefined &&
      disabledRows[courseCode] !== false &&
      !submitClicked;
    if (
      selectedGrades[courseCode] === 5 ||
      selectedGrades[courseCode] === -1 ||
      selectedGrades[courseCode] === 0
    ) {
      // Check if any prerequisite does not have a grade or is not submitted
      if (isCourseSubmitted || (prerequisites && prerequisites.trim() !== "")) {
        const prerequisiteCodes = prerequisites
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);

        const arePrerequisitesSubmitted = prerequisiteCodes.every(
          (prerequisite) => gradeSubmittedStatus[prerequisite] === true
        );

        if (!arePrerequisitesSubmitted) {
          return true; // Prerequisites are not satisfied, so disable the select button
        }
      }

      // If prerequisites are satisfied, enable the select button
      return false;
    }

    // console.log("Course Code:", courseCode);
    // console.log("Selected Grade:", selectedGrades[courseCode]);
    // console.log("isCourseSubmitted:", isCourseSubmitted);

    // console.log("gradeSubmittedStatus:", gradeSubmittedStatus);

    const isGradeSelected = selectedGrades[courseCode] !== undefined;
    const isCourseEditable = !editable[courseCode];

    // Check if the course has a grade selected, is not submitted, and is not editable
    const isDisabled =
      isGradeSelected &&
      isCourseEditable &&
      (isCourseSubmitted || disabledRows[courseCode] !== undefined);

    // Check if the grade is already submitted for the course
    const isGradeSubmitted = gradeSubmittedStatus[courseCode] === true;

    if (isDisabled || isGradeSubmitted) {
      // Disable the select button
      console.log("Select button is disabled.");
      return true;
    }
    // console.log("isGradeSelected:", isGradeSelected);
    // console.log("isCourseEditable:", isCourseEditable);
    // console.log("Final isDisabled:", isDisabled);

    const isFourthYearStanding = prerequisites.includes("Fourth Year Standing");
    if (isFourthYearStanding) {
      // Check if all courses without prerequisites for course_year = 3 and course_sem = Second Semester have grades
      const coursesWithoutPrerequisites = course.filter(
        (courseItem) =>
          courseItem.course_year === 3 &&
          courseItem.course_sem === "Second Semester" &&
          (!courseItem.pre_requisite || courseItem.pre_requisite.trim() === "")
      );

      const areAllCoursesGraded = coursesWithoutPrerequisites.every(
        (courseItem) => selectedGrades[courseItem.course_code] !== undefined
      );

      // If all courses without prerequisites have grades, enable the select button
      if (areAllCoursesGraded) {
        return false;
      }
    }

    if (
      selectedGrades[courseCode] === 5 ||
      selectedGrades[courseCode] === -1 ||
      selectedGrades[courseCode] === 0
    ) {
      return false;
    }
    // Check if any prerequisite does not have a grade or is not submitted
    if (isCourseSubmitted || (prerequisites && prerequisites.trim() !== "")) {
      const prerequisiteCodes = prerequisites
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const arePrerequisitesSubmitted = prerequisiteCodes.every(
        (prerequisite) => gradeSubmittedStatus[prerequisite] === true
      );

      if (!arePrerequisitesSubmitted) {
        // console.log("Prerequisites are not submitted. Disable select.");
        return true;
      }
    }

    // console.log("Final isDisabled:", isDisabled);

    return isDisabled;
  };

  const handleSearchIconClick = () => {
    // Find the index of the course with the matching title
    const index = allCourses.findIndex((courseGroup) =>
      courseGroup.courses.some((course) =>
        course.course_title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );

    if (index !== -1) {
      // Set the found index and scroll to the element
      setFoundCourseIndex(index);
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      // Reset the found index if not found
      setFoundCourseIndex(-1);
    }
  };

  return (
    <Flex
      flexDirection="column"
      minHeight="100vh"
      justifyContent="space-between"
      alignItems="center"
      //w="100%"
      //bgColor="#F8F8F8"
    >
      <Box
        w="100%"
        pos="sticky"
        h="6rem"
        boxShadow="lg"
        top="0"
        right="0"
        bgColor="#F3F8FF"
        zIndex="1"
      >
        <Navbar />
      </Box>

      <VStack mt="0" mb="0" flexGrow={1} w="100%">
        <InputGroup mt="8rem" ml="0" w="20rem">
          <Input
            p="1rem"
            fontFamily="inter"
            placeholder="Search Course Title"
            focusBorderColor="palette.primary"
            borderColor="rgba(0, 0, 0, .2)"
            _placeholder={{
              color: "#5C596E",
              opacity: ".7",
            }}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <InputRightElement
            marginRight=".2rem"
            fontSize="1.2rem"
            color="#2B273E"
            opacity=".5"
            transition="all .3s ease"
            borderRadius=".5rem"
            cursor="pointer"
            onClick={handleSearchIconClick}
          >
            <BsSearch />
          </InputRightElement>
        </InputGroup>
        <div ref={containerRef}>
          <VStack>
            <VStack
              mb="3rem"
              spacing={2}
              justifyContent="flex-start"
              ml="0"
              w="90vw"
              flexDirection="row"
            >
              <Text mt="-10" fontSize="19px" fontWeight="bold" pb="2rem">
                {programName}
              </Text>

              <HStack mt="2rem" mr="5rem" spacing={4}>
                <Text
                  fontWeight="bold"
                  fontSize="17.5px"
                  fontStyle="Bitter"
                  textAlign="center"
                  pb="2rem"
                >
                  {capitalizeWords(studentData.first_name)}{" "}
                  {capitalizeWords(studentData.middle_name)}{" "}
                  {capitalizeWords(studentData.last_name)}
                </Text>
                <Text pb="2rem">( {studentData.student_number})</Text>
              </HStack>
              <Button
                ml="auto"
                colorScheme="teal"
                style={{
                  color: "white",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#43766C";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#43766C";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onClick={handleDownloadPDF}
              >
                Download
              </Button>
            </VStack>

            {allCourses.length === 0 ? (
              <Text>No courses available</Text>
            ) : (
              allCourses.map((courseGroup, index) => {
                const { key, courseYear, courseSemester, schoolYear, courses } =
                  courseGroup;
                let totalLectureHours = 0;
                let totalLabHours = 0;
                let totalCourseCredits = 0;
                let countCoursesWithGrades = 0;
                let totalGrades = 0;

                courses.forEach((courseItem) => {
                  totalLectureHours += parseFloat(courseItem.num_lecture || 0);
                  totalLabHours += parseFloat(courseItem.num_lab || 0);
                  totalCourseCredits += parseFloat(courseItem.credit_unit || 0);

                  // Calculate totalGrades and increment countCoursesWithGrades
                  const grade = parseFloat(
                    selectedGrades[courseItem.course_code] || 0
                  );
                  if (grade > 0) {
                    totalGrades += grade;
                    countCoursesWithGrades++;
                  }
                });

                const gwa = calculateGPA(totalGrades, countCoursesWithGrades);

                return (
                  <Wrap
                    spacing="3"
                    w={breakPoints}
                    key={key}
                    ref={index === foundCourseIndex ? scrollRef : null}
                  >
                    <VStack
                      spacing="1"
                      align="flex-start"
                      flexDirection={{
                        base: "column",
                        md: "row",
                        lg: "row",
                      }}
                      w="90vw"
                    >
                      <HStack>
                        <Text
                          fontSize={{ base: "15px", md: "17.5px" }}
                          fontWeight="semibold"
                        >
                          {" "}
                          Year Level:{" "}
                        </Text>
                        <Text
                          w={{ base: "100%", md: "10rem" }}
                          fontWeight="md"
                          fontSize={{ base: "15px", md: "17.5px" }}
                        >
                          {`${courseYear} Year `}
                        </Text>
                      </HStack>

                      <HStack
                        ml={{
                          base: "0",
                          md: "auto",
                          lg: "auto",
                        }}
                        justifyContent="space-between"
                        w={{
                          base: "90vw",
                          md: "45vw",
                          lg: "45vw",
                        }}
                      >
                        <HStack>
                          <Text
                            fontSize={{ base: "15px", md: "17.5px" }}
                            fontWeight="semibold"
                          >
                            {" "}
                            Semester:{" "}
                          </Text>
                          <Text
                            fontWeight="md"
                            fontSize={{ base: "15px", md: "17.5px" }}
                          >
                            {`${capitalizeWords(courseSemester)} Semester `}
                          </Text>
                        </HStack>
                        <HStack w="40%">
                          <Text
                            fontSize={{ base: "15px", md: "17.5px" }}
                            fontWeight="semibold"
                            w="50%"
                          >
                            School Year:{" "}
                          </Text>
                          <Text
                            w="50%"
                            fontSize={{ base: "15px", md: "17.5px" }}
                          >
                            {schoolYear}
                          </Text>
                        </HStack>
                      </HStack>
                    </VStack>

                    <TableContainer overflowX="auto" w="90vw" mt="1rem">
                      <Table
                        variant="simple"
                        fontFamily="inter"
                        size="sm"
                        w="100%"
                        overflowX="auto"
                        style={{ minWidth: "200px" }}
                      >
                        <Thead bg="palette.primary" h="5rem">
                          <Tr>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Course Code
                            </Th>
                            <Th color="palette.secondary">Course Title</Th>
                            <Th w="1rem" color="palette.secondary">
                              Pre-Requisite(s)
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Lecture</div>
                              <div>Hours</div>
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Lab</div>
                              <div>Hours</div>
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              <div>Course</div>
                              <div>Credit</div>
                            </Th>
                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Grades
                            </Th>

                            <Th
                              style={{ textAlign: "center" }}
                              color="palette.secondary"
                            >
                              Remarks
                            </Th>
                            {(specialGradeSubmitted ||
                              courses.some(
                                (courseItem) =>
                                  gradesSubmitted[courseItem.course_code] ||
                                  (selectedGrades[courseItem.course_code] !==
                                    undefined &&
                                    (selectedGrades[courseItem.course_code] ===
                                      5 ||
                                      selectedGrades[courseItem.course_code] ===
                                        -1 ||
                                      selectedGrades[courseItem.course_code] ===
                                        0 ||
                                      selectedRemarks[
                                        courseItem.course_code
                                      ] === "Incomplete" ||
                                      selectedRemarks[
                                        courseItem.course_code
                                      ] === "Withdraw"))
                              )) && (
                              <Th
                                style={{ textAlign: "center" }}
                                color="palette.secondary"
                              >
                                Action
                              </Th>
                            )}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {courses.length === 0 ? (
                            <Tr>
                              <Td colSpan={6} textAlign="center">
                                No courses available for this semester
                              </Td>
                            </Tr>
                          ) : (
                            courses.map((courseItem) => (
                              <Tr key={courseItem.course_code}>
                                <Td fontSize="14px" fontStyle="bitter">
                                  {courseItem.course_code}
                                </Td>
                                {console.log(
                                  `Course Code: ${
                                    courseItem.course_code
                                  }, Selected Grade: ${
                                    selectedGrades[courseItem.course_code]
                                  }`
                                )}
                                <Td
                                  className="course-title-cell"
                                  fontSize="14px"
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
                                  {console.log(
                                    `Course Code: ${
                                      courseItem.course_code
                                    }, Selected Grade: ${
                                      selectedGrades[courseItem.course_code]
                                    }`
                                  )}

                                  <Select
                                    //placeholder="Grades"
                                    focusBorderColor="white"
                                    opacity=".6"
                                    w="6rem"
                                    fontSize=".7rem"
                                    fontWeight="semibold"
                                    bgColor="#EEEEEE"
                                    color="black"
                                    textAlign="center"
                                    justify="center"
                                    // isDisabled={
                                    //   editable[courseItem.course_code] === false
                                    // }
                                    isDisabled={isSelectDisabled(
                                      courseItem.course_code,
                                      courseItem.pre_requisite
                                    )}
                                    value={
                                      selectedGrades[courseItem.course_code] !==
                                      undefined
                                        ? selectedGrades[
                                            courseItem.course_code
                                          ] === 0
                                          ? "0.00"
                                          : selectedGrades[
                                              courseItem.course_code
                                            ] === -1
                                          ? "Incomplete"
                                          : selectedGrades[
                                              courseItem.course_code
                                            ].toFixed(2)
                                        : gradesForZeroOrMinusOne(
                                            courseItem.course_code
                                          )
                                    }
                                    onChange={(e) => {
                                      const courseCode = courseItem.course_code;
                                      const value = e.target.value;
                                      let remarks;

                                      if (value === "Withdraw") {
                                        // Set both grade and remarks to "Withdraw"
                                        setSelectedGrades({
                                          ...selectedGrades,
                                          [courseCode]: 0,
                                        });
                                        remarks = "Withdraw";
                                      } else if (value === "Incomplete") {
                                        setSelectedGrades({
                                          ...selectedGrades,
                                          [courseCode]: -1,
                                        });
                                        remarks = "Incomplete";
                                      } else if (value === "Grades") {
                                        // Clear the selection
                                        setSelectedGrades({
                                          ...selectedGrades,
                                          [courseCode]: undefined,
                                        });
                                      } else if (value) {
                                        setSelectedGrades({
                                          ...selectedGrades,
                                          [courseCode]: parseFloat(value),
                                        });
                                      }

                                      // Set remarks if available
                                      setSelectedRemarks({
                                        ...selectedRemarks,
                                        [courseCode]: remarks,
                                      });
                                      console.log(
                                        "New selectedGrades:",
                                        selectedGrades
                                      );
                                      console.log(
                                        "New selectedRemarks:",
                                        selectedRemarks
                                      );
                                    }}
                                  >
                                    <option
                                      style={{ color: "black" }}
                                      value="Grades"
                                    >
                                      Grades
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="1.00"
                                    >
                                      1.00
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="1.25"
                                    >
                                      1.25
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="1.50"
                                    >
                                      1.50
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="1.75"
                                    >
                                      1.75
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="2.00"
                                    >
                                      2.00
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="2.25"
                                    >
                                      2.25
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="2.50"
                                    >
                                      2.50
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="2.75"
                                    >
                                      2.75
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="3.00"
                                    >
                                      3.00
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="5.00"
                                    >
                                      5.00
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="Incomplete"
                                    >
                                      Incomplete
                                    </option>
                                    <option
                                      style={{ color: "black" }}
                                      value="0.00"
                                    >
                                      Withdraw
                                    </option>
                                  </Select>
                                </Td>
                                <Td
                                  style={{ textAlign: "center" }}
                                  fontSize="13px"
                                  fontStyle="bitter"
                                >
                                  {selectedRemarks[courseItem.course_code] ===
                                  "Incomplete"
                                    ? "Incomplete"
                                    : selectedRemarks[
                                        courseItem.course_code
                                      ] === "Withdraw"
                                    ? "Withdraw"
                                    : selectedGrades[courseItem.course_code] ===
                                      0
                                    ? "Withdraw"
                                    : selectedGrades[courseItem.course_code] ===
                                      -1
                                    ? "Incomplete"
                                    : selectedGrades[courseItem.course_code] !==
                                        undefined &&
                                      parseFloat(
                                        selectedGrades[courseItem.course_code]
                                      ) >= 1.0 &&
                                      parseFloat(
                                        selectedGrades[courseItem.course_code]
                                      ) <= 3.0
                                    ? "P"
                                    : selectedGrades[courseItem.course_code] ===
                                      5.0
                                    ? "F"
                                    : null}
                                </Td>
                                <Td
                                  style={{ textAlign: "center" }}
                                  fontSize="13px"
                                  fontStyle="bitter"
                                >
                                  {(gradesSubmitted[courseItem.course_code] ||
                                    (selectedGrades[courseItem.course_code] !==
                                      undefined &&
                                      (selectedGrades[
                                        courseItem.course_code
                                      ] === 5 ||
                                        selectedGrades[
                                          courseItem.course_code
                                        ] === -1 ||
                                        selectedGrades[
                                          courseItem.course_code
                                        ] === 0 ||
                                        selectedRemarks[
                                          courseItem.course_code
                                        ] === "Incomplete" ||
                                        selectedRemarks[
                                          courseItem.course_code
                                        ] === "Withdraw"))) && (
                                    <Button
                                      onClick={() =>
                                        handleSpecialGradeButtonClick(
                                          courseItem
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>
                                  )}
                                </Td>
                              </Tr>
                            ))
                          )}
                        </Tbody>
                        <Tfoot
                          h="2.5rem"
                          bgColor="#F0EEED"
                          colSpan="5"
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
                            <Th
                              fontSize="13px"
                              fontStyle="bitter"
                              style={{ textAlign: "center" }}
                            >
                              {gwa}
                            </Th>
                            <Th style={{ textAlign: "center" }}>
                              {" "}
                              {gwa >= 1.0 && gwa <= 3.0
                                ? "P"
                                : gwa == 5.0
                                ? "F"
                                : null}
                            </Th>
                            {(specialGradeSubmitted ||
                              courses.some(
                                (courseItem) =>
                                  gradesSubmitted[courseItem.course_code] ||
                                  (selectedGrades[courseItem.course_code] !==
                                    undefined &&
                                    (selectedGrades[courseItem.course_code] ===
                                      5 ||
                                      selectedGrades[courseItem.course_code] ===
                                        -1 ||
                                      selectedGrades[courseItem.course_code] ===
                                        0 ||
                                      selectedRemarks[
                                        courseItem.course_code
                                      ] === "Incomplete" ||
                                      selectedRemarks[
                                        courseItem.course_code
                                      ] === "Withdraw"))
                              )) && (
                              <Th
                                style={{ textAlign: "center" }}
                                color="palette.secondary"
                              ></Th>
                            )}
                          </Tr>
                        </Tfoot>
                      </Table>
                    </TableContainer>
                    <Button
                      color="white"
                      bg="palette.primary"
                      w="7rem"
                      ml="0"
                      _hover={{
                        transition: "opacity 0.1s ease-in-out",
                      }}
                      _focus={{
                        border: "none",
                        opacity: ".5",
                        transition: "opacity 0.1s ease-in-out",
                      }}
                      _active={{
                        border: "none",
                        transition: "opacity 0.1s ease-in-out",
                      }}
                      onClick={() => handleSubmit(courseGroup.key)}
                    >
                      Submit
                    </Button>
                  </Wrap>
                );
              })
            )}
          </VStack>

          {isModalOpen && (
            <SpecialGradeModal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              courseCode={modalData.courseCode}
              currentGrade={modalData.currentGrade}
              courseId={modalData.courseId}
              studentNumber={modalData.studentNumber}
              onSaveSuccess={handleGradesSaved}
            />
          )}

          <Spacer mt="10rem" />
          <Footer />
        </div>
      </VStack>
    </Flex>
  );
}

export default Curriculum;
