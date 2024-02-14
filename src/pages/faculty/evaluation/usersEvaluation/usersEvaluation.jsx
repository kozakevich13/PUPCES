import {
  Box,
  Button,
  Checkbox,
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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
//import Notice from "./notice";
import { isAfter, subDays } from "date-fns";
import Cookies from "js-cookie";
import { endPoint } from "../../../config";
import StudentAnalytics from "./studentAnalytics";

function UsersEvaluation({ studentNumber, evalYearValue, evalSemValue }) {
  const [courses, setCourses] = useState([]);
  console.log("evalsemValue pass in usersevaluaton", evalSemValue);
  const [
    selectedCoursesForRecommendation,
    setSelectedCoursesForRecommendation,
  ] = useState([]);
  console.log("Student number", studentNumber);

  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  const [facultyId, setFacultyId] = useState("");

  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [recommendFew, setRecommendFew] = useState(false);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [validatedCoursesId, setValidatedCoursesId] = useState([]);
  const [validatedCoursesDetails, setValidatedCoursesDetails] = useState([]);
  const [displayedCourseCodes, setDisplayedCourseCodes] = useState([]);
  const [selectedCourseCode, setSelectedCourseCode] = useState("");
  const [evaluatedCourses, setEvaluatedCourses] = useState([]);
  const [studentData, setStudentData] = useState({});
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const toast = useToast();
  const [evaluationDate, setEvaluationDate] = useState("");
  const [recommendedDates, setRecommendedDates] = useState({});
  const [prerequisiteCourses, setPrerequisiteCourses] = useState([]);
  const [courseCodePrerequisite, setCourseCodePrerequisite] = useState([]);
  const [summerCourses, setSummerCourses] = useState([]);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [totalRecommendedCreditUnits, setTotalRecommendedCreditUnits] =
    useState(0);
  const [programId, setProgramId] = useState();
  const [strand, setStrand] = useState("");
  const [allowOverload, setAllowOverload] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [validatedCourseCode, setValidatedCourseCode] = useState([]);
  const [validatedPrerequisite, setValidatedPrerequisite] = useState([]);
  const [validatedPrerequisiteId, setValidatedPrerequisiteId] = useState([]);
  const [programName, setProgramName] = useState("");
  const [curriculumMap, setCurriculumMap] = useState(new Map());
  const [allowRecommendAgain, setAllowRecommendAgain] = useState(false);
  console.log("UsersEvaluation component rendering...");

  useEffect(() => {
    console.log("Eval Year Value in UsersEvaluation:", evalYearValue);
    console.log("Eval Semester Value in UsersEvaluation:", evalSemValue);
  }, [evalYearValue, evalSemValue]);

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === programId
        );

        console.log("Selected Program:", selectedProgram);

        if (selectedProgram) {
          const program_name = selectedProgram.program_name;
          console.log("Program Name:", program_name);
          setProgramName(program_name);
          console.log("Program Name has been set:", program_name);
        } else {
          console.error("Program not found");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
      }
    };

    fetchProgramData();
  }, [programId]);

  //fetch faculty
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;
          setFacultyId(facultyData.faculty_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {}, [studentNumber]);
  //fetch students
  useEffect(() => {
    console.log("Fetching student data...");
    axios
      .get(`${endPoint}/students?studentNumber=${studentNumber}`)
      .then((response) => {
        const studentData = response.data;
        setStudentData(studentData);
        setProgramId(studentData.program_id);
        console.log("Program id in use:", studentData.program_id);
        setStrand(studentData.strand);

        console.log("Student data fetched:", studentData);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      })
      .finally(() => {
        console.log("Fetching student data complete.");
      });
  }, [studentNumber]);

  useEffect(() => {
    console.log("Program id in usersevaluation:", programId);
    console.log("Strand:", strand);
  }, [programId, strand]);

  const getCourseType = (studentNumber) => {
    if (
      studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019") ||
      studentNumber.startsWith("2018")
    ) {
      return 2019;
    } else {
      return 2022;
    }
  };
  //fetch curriculum
  useEffect(() => {
    console.log("Fetching course data...");
    console.log("Program id in fetching curriculum:", programId);
    console.log("Student Number:", studentNumber);
    const currentCourseType = getCourseType(studentNumber);
    console.log("Current Course Type:", currentCourseType);

    axios
      .get(
        `${endPoint}/curriculum?program_id=${programId}&year_started=${currentCourseType}`
      )
      .then((res) => {
        const courseData = res.data;
        console.log("API Response Data:", courseData);
        setCourses(courseData);
        console.log("CourseData", courseData);
        console.log("Current Courses State:", courseData);

        setCourses((prevCourses) => {
          console.log("Previous Courses State:", prevCourses);
          return courseData;
        });

        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);

        // Filter courses that have a summer semester
        const summer = courseData.filter((course) =>
          course.course_sem.includes("Summer Semester")
        );

        // Set state with summer courses
        setSummerCourses(summer);

        // Extract prerequisite course codes from the curriculum data
        const prerequisiteCourseCodes = courseData
          .filter(
            (course) =>
              course.pre_requisite && course.pre_requisite.trim() !== ""
          )
          .map((course) => course.pre_requisite.trim().split(","));

        const trimmedPrerequisiteCourseCodes = prerequisiteCourseCodes
          .flat()
          .map((code) => code.trim());

        setPrerequisiteCourses(trimmedPrerequisiteCourseCodes);
        // Console.log the prerequisite course codes
        console.log("Prerequisite Courses:", trimmedPrerequisiteCourseCodes);

        console.log("Filtered Summer Semester:", summer);
      })

      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [programId, studentNumber]);

  useEffect(() => {
    console.log("Summer Courses outside:", summerCourses);
  }, [summerCourses]);

  //fetch curriculm and its prerequisite
  useEffect(() => {
    const currentCourseType = getCourseType(studentNumber);
    const fetchCousePrerequisiteData = async () => {
      try {
        const response = await fetch(
          `${endPoint}/curriculum-prerequisite?program_id=${programId}&year_started=${currentCourseType}`
        );
        const data = await response.json();

        console.log("Fetched course code of pre requisite data:", data);

        // Set the fetched data in the local state
        setCourseCodePrerequisite(data);
      } catch (error) {
        console.error("Error fetching curriculum data:", error);
      }
    };

    fetchCousePrerequisiteData();
  }, [programId, studentNumber]);

  console.log("programId outside:", programId);

  //validate
  useEffect(() => {
    // Fetch the validation data for the given student
    axios
      .get(`${endPoint}/validate`, {
        params: {
          student_number: studentNumber,
        },
      })
      .then((res) => {
        const validationData = res.data;
        console.log("Raw Validation Data:", validationData);

        if (Array.isArray(validationData)) {
          // Extract validated course IDs based on your data structure
          const validated = validationData
            .filter((data) => data.course_id) // Assuming course_id is present
            .map((data) => data.course_id);

          setValidatedCoursesId(validated);
          console.log("Validated Course Id:", validated);
        } else {
          console.error("Validation data is not an array:", validationData);
        }
      })
      .catch((error) => {
        console.error("Error fetching validation data:", error);
      });
  }, [courses, studentNumber]);

  console.log("Validated Course Id:", validatedCoursesId);

  //course code of validated id
  useEffect(() => {
    // Check if courses is not empty and validatedCoursesId is not empty
    if (courses.length > 0 && validatedCoursesId.length > 0) {
      // Get course codes for validated courses
      const validatedCourseCodes = validatedCoursesId.map((courseId) => {
        const course = courses.find((c) => c.course_id === courseId);
        return course ? course.course_code : null;
      });

      console.log("Course Codes for Validated Courses:", validatedCourseCodes);
      setValidatedCourseCode(validatedCourseCodes);
    }
  }, [courses, validatedCoursesId]);

  console.log("Validated Course Code", validatedCourseCode);

  // Log validated prerequisites for validated courses
  useEffect(() => {
    // Check if both prerequisiteCourses and validatedCourseCode are not empty
    if (prerequisiteCourses.length > 0 && validatedCourseCode.length > 0) {
      // Use Set to store unique course codes
      const uniqueMatchedCourseCodes = [
        ...new Set(
          prerequisiteCourses.filter((courseCode) =>
            validatedCourseCode.includes(courseCode)
          )
        ),
      ];

      setValidatedPrerequisite(uniqueMatchedCourseCodes);
      // Log the result
      console.log("Pre requisite that is validated:", uniqueMatchedCourseCodes);
      // Get course_id for each validated course_code
      const courseIds = uniqueMatchedCourseCodes.map((courseCode) => {
        const course = courses.find((c) => c.course_code === courseCode);
        return course ? course.course_id : null;
      });

      setValidatedPrerequisiteId(courseIds);
      // Log the course_ids
      console.log(" Pre requisite that is Validated Course Ids:", courseIds);
    }
  }, [courses, prerequisiteCourses, validatedCourseCode]);

  console.log("valid prereq", validatedPrerequisite);
  console.log("valid prereq ID", validatedPrerequisiteId);

  //validated details
  useEffect(() => {
    // Fetch additional details for validated courses
    const validatedCoursesDetailsPromises = validatedCoursesId.map(
      (courseCode) => axios.get(`${endPoint}/curriculum/${courseCode}`)
    );

    Promise.all(validatedCoursesDetailsPromises)
      .then((detailsResponses) => {
        const validatedCoursesDetails = detailsResponses.map(
          (response) => response.data
        );

        // Update the validatedCoursesDetails state
        setValidatedCoursesDetails(validatedCoursesDetails);
      })
      .catch((error) => {
        console.error("Error fetching course details:", error);
      });
  }, [validatedCoursesId]);
  console.log("Validated Courses Details:", validatedCoursesDetails);

  const calculateNextYearSemester = (
    latestValidatedCourse,
    currentSemester,
    summerCourses
  ) => {
    if (!latestValidatedCourse) {
      // Default to First Year if no courses are validated
      return { year: 1, semester: "First Semester" };
    }

    const { course_year } = latestValidatedCourse;

    if (currentSemester === "First Semester") {
      return { year: course_year, semester: "Second Semester" };
    } else if (currentSemester === "Second Semester") {
      const hasSummerSemester = summerCourses.length > 0;

      if (hasSummerSemester) {
        // Find the latest summer course for the current year
        const latestSummerCourse = summerCourses.find(
          (course) => course.course_year === course_year
        );

        if (latestSummerCourse) {
          // Update the current school year based on the latest validated course
          return {
            year: latestSummerCourse.course_year,
            semester: "Summer Semester",
          };
        } else {
          // If there's no summer course for the current year, move to the next year
          return { year: course_year + 1, semester: "First Semester" };
        }
      } else {
        // If there's no summer semester, move to the next year
        return { year: course_year + 1, semester: "First Semester" };
      }
    } else if (currentSemester === "Summer Semester") {
      // Move to the next year
      const adjustedYear = course_year + 1;
      return { year: adjustedYear, semester: "First Semester" };
    } else {
      // Default case: Move to the next year
      return { year: course_year + 1, semester: "First Semester" };
    }
  };

  const latestValidatedCourse =
    validatedCoursesDetails.length > 0
      ? validatedCoursesDetails[validatedCoursesDetails.length - 1]
      : null;

  // Determine the current year and semester
  let currentSchoolYear = 1; // Default to First Year if no courses are validated
  let currentSemester = "First Semester";

  if (latestValidatedCourse) {
    currentSchoolYear = latestValidatedCourse.course_year;
    currentSemester = latestValidatedCourse.course_sem;
  }

  // Calculate the next year and semester
  const { year: nextSchoolYear, semester: nextSemester } =
    calculateNextYearSemester(
      latestValidatedCourse,
      currentSemester,
      summerCourses
    );

  console.log(
    `Current Year: ${evalYearValue}, Current Semester: ${evalSemValue}`
  );

  //units endpoints
  useEffect(() => {
    console.log("Running useEffect for totalCreditUnits...");
    console.log("Eval Year Value before setting endpoint:", evalYearValue);
    console.log("Eval Semester Value before setting endpoint:", evalSemValue);
    const currentCourseType = getCourseType(studentNumber);
    let endpoint = "";
    console.log("programId inside useefec:", programId);
    console.log("Conditions met:", evalYearValue >= 1 && evalYearValue <= 4);
    console.log(
      "Semester conditions met:",
      evalSemValue === "First Semester" ||
        evalSemValue === "Second Semester" ||
        evalSemValue === "Summer Semester"
    );

    if (
      evalYearValue >= "1" &&
      evalYearValue <= "6" &&
      (evalSemValue === "First Semester" ||
        evalSemValue === "Second Semester" ||
        evalSemValue === "Summer Semester")
    ) {
      console.log("Conditions met: true");
      console.log("evalYearValue:", evalYearValue);
      console.log("evalSemValue:", evalSemValue);
      console.log("programId inside if:", programId);
      console.log("currentCourseType:", currentCourseType);

      if (evalYearValue === "1" && evalSemValue === "First Semester") {
        endpoint = `${endPoint}/curriculum-first-first?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "1" && evalSemValue === "Second Semester") {
        endpoint = `${endPoint}/curriculumfirst-second?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "2" && evalSemValue === "First Semester") {
        endpoint = `${endPoint}/curriculumsecond-first?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "2" && evalSemValue === "Second Semester") {
        endpoint = `${endPoint}/curriculumsecond-second?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "3" && evalSemValue === "First Semester") {
        endpoint = `${endPoint}/curriculumthird-first?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "3" && evalSemValue === "Second Semester") {
        endpoint = `${endPoint}/curriculumthird-second?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "4" && evalSemValue === "First Semester") {
        endpoint = `${endPoint}/curriculumfourth-first?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "4" && evalSemValue === "Second Semester") {
        endpoint = `${endPoint}/curriculumfourth-second?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalSemValue === "Summer Semester") {
        endpoint = `${endPoint}/curriculumsummer?program_id=${programId}&year_started=${currentCourseType}`;
      } else if (evalYearValue === "5" || evalYearValue === "6") {
        // Set totalCreditUnits to 20 for evalYearValue equal to 5 or 6
        setTotalCreditUnits(20);
      } else {
        // Handle other cases or set a default endpoint if needed
        console.log("Invalid evalYearValue or evalSemValue");
      }
    }
    // Now 'endpoint' contains the desired endpoint based on the conditions
    console.log(`Selected Endpoint: ${endpoint}`);

    console.log("Fetching data from:", endpoint);

    fetch(endpoint)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Response data:", data);
        const numericTotalCreditUnits = parseInt(data.total_credit_units, 10);
        if (!isNaN(numericTotalCreditUnits)) {
          setTotalCreditUnits(numericTotalCreditUnits);
        } else {
          console.error(
            "Invalid total_credit_units value:",
            data.total_credit_units
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [evalYearValue, evalSemValue, studentNumber, programId]);

  useEffect(() => {
    console.log("TotalCreditUnits in endpoint", totalCreditUnits);
  }, [totalCreditUnits]);

  //evaluate
  useEffect(() => {
    axios
      .get(`${endPoint}/evaluate-student`, {
        params: {
          student_number: studentNumber,
        },
      })
      .then((res) => {
        const evaluationData = res.data;
        console.log("Evaluation Data:", evaluationData);

        if (Array.isArray(evaluationData)) {
          const evaluated = evaluationData
            .filter((data) => data.date_eval)
            .map((data) => data.course_reco);
          console.log("Evaluation Data:", evaluationData);
          console.log("Evaluated Courses:", evaluated);
          setEvaluatedCourses(evaluated);

          // Fetch and update the recommended dates from the server
          const recommendedDates = {};
          for (const data of evaluationData) {
            if (data.date_eval) {
              recommendedDates[data.course_reco] = data.date_eval;
            }
          }
          console.log("Recommended Dates:", recommendedDates);
          setRecommendedDates(recommendedDates);
        } else {
          console.error("Evaluation data is not an array:", evaluationData);
        }
      })
      .catch((error) => {
        console.error("Error fetching evaluation data:", error);
      });
  }, [studentNumber]);

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

  const availableYears = [1, 2, 3, 4]; // You can adjust this array as needed
  const availableSemesters = ["First Semester", "Second Semester", "Summer"]; // Adjust as needed

  // Initialize filteredCourses as an empty object
  const filteredCourses = {};

  // Function to filter courses based on the selected year and semester

  // const filterCourses = (year, semester) => {
  //   console.log("Filtering courses for Year:", year, "Semester:", semester);
  //   if (!year && !semester) {
  //     // Display all courses that are not validated or don't have date_validated
  //     return courses.filter(
  //       (courseItem) =>
  //         !validatedCoursesId.includes(courseItem.course_id) ||
  //         courseItem.date_validated === null
  //     );
  //   } else if (year && !semester) {
  //     // Display unvalidated courses for the selected year regardless of the semester
  //     return courses.filter(
  //       (courseItem) =>
  //         courseItem.course_year === parseInt(year) && // Include the condition for course_year
  //         (!validatedCoursesId.includes(courseItem.course_id) ||
  //           courseItem.date_validated === null)
  //     );
  //   } else if (!year && semester) {
  //     // Display unvalidated courses for the selected semester regardless of the year
  //     return courses.filter(
  //       (courseItem) =>
  //         courseItem.course_sem === semester &&
  //         (!validatedCoursesId.includes(courseItem.course_id) ||
  //           courseItem.date_validated === null)
  //     );
  //   } else {
  //     // Display unvalidated courses for the selected year and semester
  //     return courses.filter(
  //       (courseItem) =>
  //         courseItem.course_year === parseInt(year) && // Include the condition for course_year
  //         courseItem.course_sem === semester &&
  //         (!validatedCoursesId.includes(courseItem.course_id) ||
  //           courseItem.date_validated === null)
  //     );
  //   }
  // };

  const yesterday = subDays(new Date(), 1);

  function groupByYearAndSemester(courses) {
    const groupedCourses = {};

    courses.forEach((course) => {
      const key = `${course.course_year} Year ${course.course_sem}`;
      if (!groupedCourses[key]) {
        groupedCourses[key] = [];
      }
      groupedCourses[key].push(course);
    });

    return groupedCourses;
  }

  const filterCourses = (year, semester) => {
    console.log("Filtering courses for Year:", year, "Semester:", semester);

    return courses.filter((courseItem) => {
      const courseCodePrereq = courseCodePrerequisite.find(
        (prereq) => prereq.course_code === courseItem.course_code
      );

      const hasPrerequisites =
        courseCodePrereq &&
        courseCodePrereq.pre_requisite &&
        Array.isArray(courseCodePrereq.pre_requisite) &&
        courseCodePrereq.pre_requisite.length > 0;

      const prereqsAreValidated =
        hasPrerequisites &&
        courseCodePrereq.pre_requisite.every((prereqCode) =>
          validatedPrerequisite.includes(prereqCode)
        );

      const isUnvalidated =
        !validatedCoursesId.includes(courseItem.course_id) ||
        courseItem.date_validated === null;

      const isMatchingYear = !year || courseItem.course_year === parseInt(year);
      const isMatchingSemester =
        !semester || courseItem.course_sem === semester;

      // Check if date_eval is yesterday
      const isEvaluatedYesterday =
        courseItem.date_eval &&
        isAfter(new Date(courseItem.date_eval), yesterday);

      const includeWithoutPrerequisites =
        !hasPrerequisites &&
        isUnvalidated &&
        isMatchingYear &&
        isMatchingSemester &&
        !isEvaluatedYesterday;

      const includeWithPrerequisites =
        hasPrerequisites &&
        prereqsAreValidated &&
        isUnvalidated &&
        isMatchingYear &&
        isMatchingSemester &&
        !isEvaluatedYesterday;

      // Special case for "Bridging" semester
      const includeBridging =
        semester === "Bridging" && courseItem.course_sem === "Bridging";

      const isCourseValidated = validatedCoursesId.includes(
        courseItem.course_id
      );

      const shouldIncludeCourse =
        (includeWithoutPrerequisites ||
          includeWithPrerequisites ||
          includeBridging) &&
        !isCourseValidated;

      if (shouldIncludeCourse) {
        console.log(
          `Included Course: ${courseItem.course_code}, ID: ${courseItem.course_id}, Year: ${courseItem.course_year}, Semester: ${courseItem.course_sem}, coursetype: ${courseItem.course_type}`
        );
      } else {
        console.log(
          `Excluded Course: ${courseItem.course_code}, ID: ${courseItem.course_id}, Year: ${courseItem.course_year}, Semester: ${courseItem.course_sem} coursetype: ${courseItem.course_type}`
        );
        // Debugging: Log additional information
        console.log(
          "Additional Info:",
          isUnvalidated,
          isMatchingYear,
          isMatchingSemester,
          hasPrerequisites,
          prereqsAreValidated
        );
      }

      return shouldIncludeCourse;
    });
  };

  if (selectedYear || selectedSemester) {
    // Display courses based on selected year and/or semester
    console.log("Filtering courses based on selected year and/or semester...");

    // Use selected values if available, otherwise, use null for the respective parameter
    const yearToFilter = selectedYear || null;
    const semesterToFilter = selectedSemester || null;

    const filtered = filterCourses(yearToFilter, semesterToFilter);

    if (selectedYear === "All Years" && selectedSemester === "All Semester") {
      // Display all courses for all years and all semesters or when no specific year is selected
      console.log("Displaying all courses for all years and semesters...");
      availableYears.forEach((year) => {
        availableSemesters.forEach((semester) => {
          const semesterKey = semester;
          const filtered = filterCourses(year, semester);
          // Log the year, semester, and filtered array length
          console.log(
            "Year:",
            year,
            "Semester:",
            semester,
            "Filtered Count:",
            filtered.length
          );

          // Check if the filtered courses array is not empty before adding to filteredCourses
          if (filtered.length > 0) {
            const key = `${year} Year ${semesterKey}`;
            filteredCourses[key] = filtered;
            console.log("Filtered Courses:", filteredCourses);
          }
        });
      });
    } else if (selectedYear === "All Years") {
      // Display courses for all years and the selected semester or when no specific semester is selected
      const allYearsCourses = [];

      availableYears.forEach((year) => {
        const filtered = filterCourses(year, selectedSemester);
        allYearsCourses.push(...filtered);
      });

      // Group the courses by year and semester
      const groupedCourses = groupByYearAndSemester(allYearsCourses);

      // Display the grouped courses
      Object.keys(groupedCourses).forEach((key) => {
        console.log(`${key} - Count: ${groupedCourses[key].length}`);
        filteredCourses[key] = groupedCourses[key];
      });
    } else if (selectedSemester === "All Semester") {
      // Display courses for the selected year across all semesters or when no specific year is selected
      console.log(`${selectedYear} Year - Count: ${filtered.length}`);
      availableSemesters.forEach((semester) => {
        const filtered = filterCourses(selectedYear, semester);
        console.log(
          `${selectedYear} Year ${semester} - Count: ${filtered.length}`
        );

        if (filtered.length > 0) {
          const key = `${selectedYear} Year ${semester}`;
          if (!filteredCourses[key]) {
            filteredCourses[key] = [];
          }
          // Concatenate the courses to the existing array
          filteredCourses[key] = filteredCourses[key].concat(filtered);
          console.log("Filtered Courses:", filteredCourses);
        }
      });
    } else if (selectedYear && selectedSemester) {
      // Display courses for the selected year and semester
      console.log(
        `${selectedYear} Year ${selectedSemester} - Count: ${filtered.length}`
      );
      filteredCourses[`${selectedYear} Year ${selectedSemester}`] = filtered;
    } else if (selectedYear && !selectedSemester) {
      // Display courses for the selected year across all semesters
      console.log(`${selectedYear} Year - Count: ${filtered.length}`);
      availableSemesters.forEach((semester) => {
        const filtered = filterCourses(selectedYear, semester);
        console.log(
          `${selectedYear} Year ${semester} - Count: ${filtered.length}`
        );

        if (filtered.length > 0) {
          const key = `${selectedYear} Year ${semester}`;
          if (!filteredCourses[key]) {
            filteredCourses[key] = [];
          }
          // Concatenate the courses to the existing array
          filteredCourses[key] = filteredCourses[key].concat(filtered);
          console.log("Filtered Courses:", filteredCourses);
        }
      });
    } else if (selectedSemester && !selectedYear) {
      // Display courses for the selected semester across all years
      console.log(`${selectedSemester} - Count: ${filtered.length}`);
      availableYears.forEach((year) => {
        const filteredYear = filterCourses(year, selectedSemester);
        console.log(
          `${year} Year ${selectedSemester} - Count: ${filteredYear.length}`
        );
        filteredCourses[`${year} Year ${selectedSemester}`] = filteredYear;
      });
    }
  } else if (selectedSemester === "Bridging") {
    // Display courses for the "Bridging" semester without separating by year
    console.log("Displaying courses for Bridging semester...");

    // Check if "Bridging" is included in available semesters
    if (availableSemesters.includes("Bridging")) {
      const bridgingFiltered = filterCourses(0, "Bridging");

      // Log the course codes for the Bridging semester
      const bridgingCourseCodes = bridgingFiltered.map(
        (course) => course.course_code
      );
      console.log(`Bridging Semester - Course Codes:`, bridgingCourseCodes);

      // Save the filtered courses for later use if needed
      console.log(`Bridging Semester - Count: ${bridgingFiltered.length}`);

      // Include Bridging courses in a single table with a consistent key
      filteredCourses["Bridging Semester"] = bridgingFiltered;

      console.log("Filtered Courses:", filteredCourses);
    }
  } else if (evalSemValue) {
    // No selection in both, use evalSemValue for filtering
    console.log("No selection. Using evalSemValue for filtering...");
    const semesterKey = evalSemValue;
    availableYears.forEach((year) => {
      const filtered = filterCourses(year, evalSemValue);
      console.log(`${year} Year ${evalSemValue} - Count: ${filtered.length}`);
      filteredCourses[`${year} Year ${semesterKey}`] = filtered;
    });
  } else {
    // No selection in both, and no evalSemValue, display all available courses
    console.log("Displaying all courses for each year and semester...");
    availableYears.forEach((year) => {
      availableSemesters.forEach((semester) => {
        const semesterKey = semester;
        const filtered = filterCourses(year, semester);
        // Log the year, semester, and filtered array length
        console.log(
          "Year:",
          year,
          "Semester:",
          semester,
          "Filtered Count:",
          filtered.length
        );

        // Check if the filtered courses array is not empty before adding to filteredCourses
        if (filtered.length > 0) {
          const key = `${year} Year ${semesterKey}`;
          filteredCourses[key] = filtered;
          console.log("Filtered Courses:", filteredCourses);
        }
      });
    });
  }

  useEffect(() => {
    console.log("Filtered Courses (after update):", filteredCourses);
  }, [filteredCourses, evalYearValue, evalSemValue]);

  useEffect(() => {
    console.log(
      "Total Credit Units of Recommended courses:",
      totalRecommendedCreditUnits
    );
  }, [totalRecommendedCreditUnits]);

  useEffect(() => {
    console.log("nextSchoolYear:", evalYearValue);
    console.log("nextSemester:", evalSemValue);
    console.log("totalCreditUnits:", totalCreditUnits);
    // Reset totalRecommendedCreditUnits to 0 when nextSchoolYear or nextSemester or totalCreditUnits changes
    setTotalRecommendedCreditUnits(0);
  }, [evalYearValue, evalSemValue, totalCreditUnits]);

  useEffect(() => {
    setTotalRecommendedCreditUnits(0);
    const fetchTotalEvaluatedCreditUnits = async () => {
      try {
        const response = await axios.get(
          `${endPoint}/evaluate-units?eval_year=${evalYearValue}&eval_sem=${evalSemValue}&student_number=${studentNumber}`
        );

        const totalEvaluatedCreditUnits = response.data.totalEvalCredit;

        console.log("Total Evaluated Credit Units:", totalEvaluatedCreditUnits);
        setTotalRecommendedCreditUnits(totalEvaluatedCreditUnits);
        console.log(
          "Updated Total Recommended Credit Units:",
          totalRecommendedCreditUnits
        );
      } catch (error) {
        console.error("Error fetching total evaluated credit units:", error);
      }
    };

    fetchTotalEvaluatedCreditUnits();
  }, [evalYearValue, evalSemValue, totalCreditUnits, studentNumber]);

  // let isTableRendered = false;
  const handleCheckboxChange = (e, courseCode) => {
    if (e.target.checked) {
      setSelectedCoursesForRecommendation((prevSelectedCourses) => {
        const updatedSelectedCourses = [...prevSelectedCourses, courseCode];
        console.log("Selected Courses:", updatedSelectedCourses);
        return updatedSelectedCourses;
      });
    } else {
      setSelectedCoursesForRecommendation((prevSelectedCourses) => {
        const updatedSelectedCourses = prevSelectedCourses.filter(
          (code) => code !== courseCode
        );
        console.log("Selected Courses:", updatedSelectedCourses);
        return updatedSelectedCourses;
      });
    }
  };

  const recommendSelectedCourses = async () => {
    try {
      // Check if there are selected courses
      if (selectedCoursesForRecommendation.length === 0) {
        // Display a message if there are no selected courses
        toast({
          title: "No Courses Selected",
          description: "Please select courses to recommend.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Fetch the evaluated courses for the student
      const response = await axios.get(`${endPoint}/evaluate-student`, {
        params: {
          student_number: studentNumber,
        },
      });

      const evaluatedCourses = response.data;

      // Variable to track the total recommended credit units
      let updatedTotalRecommendedCreditUnits = totalRecommendedCreditUnits;

      for (const courseCode of selectedCoursesForRecommendation) {
        // Check if the course has already been evaluated
        const isCourseEvaluated = evaluatedCourses.some(
          (course) =>
            course.course_reco.toUpperCase().replace(/\s/g, "") ===
              courseCode.toUpperCase().replace(/\s/g, "") &&
            course.student_number === studentNumber
        );

        if (!isCourseEvaluated || allowRecommendAgain) {
          const currentCourseType = getCourseType(studentNumber);

          // Fetch the course details to get its credit units
          const courseDetailsResponse = await axios.get(
            `${endPoint}/evalcurriculum?program_id=${programId}&year_started=${currentCourseType}&course_code=${courseCode}`
          );

          const courseDetailsArray = courseDetailsResponse.data;

          // Check if the array is not empty
          if (courseDetailsArray.length > 0) {
            const courseDetails = courseDetailsArray[0];

            console.log(
              `Credit unit for ${courseCode}: ${courseDetails.credit_unit}`
            );
            console.log(`- Course Title: ${courseDetails.course_title}`);
            console.log(`- Course Year: ${courseDetails.course_year}`);
            console.log(`- Course Sem: ${courseDetails.course_sem}`);
            console.log(`- Course Program: ${courseDetails.program_id}`);
            console.log(`- Course Type: ${courseDetails.course_type}`);

            // Check if recommending this course exceeds the remaining credit units
            if (
              !allowOverload &&
              courseDetails.credit_unit + updatedTotalRecommendedCreditUnits >
                totalCreditUnits
            ) {
              // Show a toast indicating that recommending this course exceeds the remaining credit units
              toast({
                title: "Exceeded Remaining Credit Units",
                description: `Recommendation for ${courseCode} exceeds the remaining credit units.`,
                status: "warning",
                duration: 5000,
                isClosable: true,
              });
              return; // Stop further execution if credit units exceeded
            }

            // Update the currentDate state with the current date
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${
              today.getMonth() + 1
            }-${today.getDate()}`;

            setEvaluationDate(formattedDate);
            setSelectedCourseCode(courseCode);

            setRecommendedDates((prevDates) => ({
              ...prevDates,
              [courseCode]: formattedDate,
            }));

            // Send the date along with other data to the server
            await axios.post(`${endPoint}/evaluate`, {
              course_reco: courseCode,
              evalcredit_unit: courseDetails.credit_unit,
              requiredcredit_unit: totalCreditUnits,
              faculty_id: facultyId,
              student_number: studentNumber,
              date_eval: formattedDate,
              eval_year: evalYearValue,
              eval_sem: evalSemValue,
            });

            // Accumulate the credit units properly
            updatedTotalRecommendedCreditUnits += courseDetails.credit_unit;

            // Display a success message for each recommendation
            toast({
              title: "Course Recommended",
              description: `Course ${courseCode} has been recommended successfully.`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            console.error("Invalid response structure from the server");
            // Handle the error or log a message
          }
        } else {
          // Show a toast indicating that the course has already been recommended
          toast({
            title: "Course Already Recommended",
            description: `Course ${courseCode} has already been recommended.`,
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }

      // Set the total recommended credit units
      setTotalRecommendedCreditUnits(updatedTotalRecommendedCreditUnits);

      // Clear the displayed course codes after recommendations
      setDisplayedCourseCodes([]);
      setSelectedCourses([]);
      setSelectedCoursesForRecommendation([]);
    } catch (error) {
      // Handle the error for recommending selected courses
      toast({
        title: "Error Recommending Selected Courses",
        description: "There was an error recommending selected courses.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error recommending selected courses:", error);
    }
  };

  const handleRecommendAll = async () => {
    try {
      // Check if there are displayed course codes
      if (displayedCourseCodes.length === 0) {
        // Display a message if there are no courses to recommend
        toast({
          title: "No Courses to Recommend",
          description: "There are no courses to recommend.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Ensure uniqueness of displayed course codes
      const uniqueDisplayedCourseCodes = Array.from(
        new Set(displayedCourseCodes)
      );

      console.log("All Displayed Courses:", uniqueDisplayedCourseCodes);

      // Fetch the evaluated courses for the student
      const response = await axios.get(`${endPoint}/evaluate-student`, {
        params: {
          student_number: studentNumber,
        },
      });

      const evaluatedCourses = response.data;

      // Filter unique codes that are not already recommended and are currently displayed
      const coursesToRecommend = uniqueDisplayedCourseCodes.filter(
        (code) =>
          !evaluatedCourses.some(
            (course) =>
              course.course_reco.toUpperCase().replace(/\s/g, "") ===
                code.toUpperCase().replace(/\s/g, "") &&
              course.student_number === studentNumber
          )
      );

      console.log("Evaluated Courses:", evaluatedCourses);
      console.log("Courses to Recommend:", coursesToRecommend);

      //  Check if any of the courses are already recommended
      if (coursesToRecommend.length === 0) {
        // Display a toast indicating that the course is already recommended
        toast({
          title: "All Displayed Courses Already Recommended",
          description:
            "All currently displayed courses are already recommended.",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Initialize a variable to track the total credit units to be recommended
      let totalCreditUnitsToRecommend = 0;
      let remainingCreditUnits = totalCreditUnits - totalRecommendedCreditUnits;

      console.log("Entering recommendation loop");
      // Recommendation logic for each displayed course
      for (const courseCode of coursesToRecommend) {
        // Check if the course code is in the filtered courses
        const isCourseInFiltered = Object.values(filteredCourses).some(
          (courses) =>
            courses.some((course) => course.course_code === courseCode)
        );

        console.log(
          `Course ${courseCode} in filtered courses: ${isCourseInFiltered}`
        );

        // Check if the course already has a date_eval

        if (isCourseInFiltered) {
          console.log(`Recommendation logic for ${courseCode} is executing`);
          // Fetch the course details to get its credit units
          const courseDetailsResponse = await axios.get(
            `${endPoint}/curriculum/${courseCode}`
          );

          const courseDetails = courseDetailsResponse.data;
          console.log(
            `Credit Units for ${courseCode}:`,
            courseDetails.credit_unit
          );

          if (
            !allowOverload &&
            courseDetails.credit_unit > remainingCreditUnits
          ) {
            // Show a toast indicating that recommending this course exceeds the remaining credit units
            toast({
              title: "Exceeded Remaining Credit Units",
              description: `Recommendation for ${courseCode} exceeds the remaining credit units.`,
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
            continue; // Skip to the next iteration if credit units exceeded
          }

          // Update the currentDate state with the current date
          const today = new Date();
          const formattedDate = `${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;

          setEvaluationDate(formattedDate);
          setSelectedCourseCode(courseCode);

          setRecommendedDates((prevDates) => ({
            ...prevDates,
            [courseCode]: formattedDate,
          }));
          console.log("Total Credit Units before post:", totalCreditUnits);

          // Send the date along with other data to the server
          await axios.post(`${endPoint}/evaluate`, {
            course_reco: courseCode,
            evalcredit_unit: courseDetails.credit_unit,
            requiredcredit_unit: totalCreditUnits,
            faculty_id: facultyId,
            student_number: studentNumber,
            date_eval: formattedDate,
            eval_year: evalYearValue,
            eval_sem: evalSemValue,
          });
          console.log(`Recommendation for ${courseCode} completed`);

          // Accumulate the credit units properly
          remainingCreditUnits -= courseDetails.credit_unit;

          // Display a success message for each recommendation
          toast({
            title: "Course Recommended",
            description: `Course ${courseCode} has been recommended successfully.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      }
      console.log(
        "Final Total Credit Units To Recommend:",
        totalCreditUnitsToRecommend
      );
      console.log("Total Credit Units:", totalCreditUnits);

      if (totalCreditUnitsToRecommend > totalCreditUnits) {
        // Show a toast indicating that the total recommended credit units exceed the remaining credit units
        toast({
          title: "Exceeded Remaining Credit Units",
          description:
            "Total recommended credit units exceed the remaining credit units.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return; // Stop the function execution
      }

      // Update the totalRecommendedCreditUnits with the computed credit units
      setTotalRecommendedCreditUnits(totalCreditUnits - remainingCreditUnits);

      // Clear the displayed course codes after recommendations
      setDisplayedCourseCodes([]);
    } catch (error) {
      // Handle the error (you can use a toast or any other method)
      toast({
        title: "Error Recommending Course",
        description: "There was an error recommending the course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error recommending course:", error);
    }
  };

  const handleRecommendAgain = async () => {
    try {
      // Check if there are displayed course codes
      if (displayedCourseCodes.length === 0) {
        // Display a message if there are no courses to recommend
        toast({
          title: "No Courses to Recommend",
          description: "There are no courses to recommend.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Ensure uniqueness of displayed course codes
      const uniqueDisplayedCourseCodes = Array.from(
        new Set(displayedCourseCodes)
      );

      console.log("All Displayed Courses:", uniqueDisplayedCourseCodes);

      // Fetch the evaluated courses for the student
      const response = await axios.get(`${endPoint}/evaluate-student`, {
        params: {
          student_number: studentNumber,
        },
      });

      const evaluatedCourses = response.data;

      // Filter unique codes that are not already recommended and are currently displayed
      const coursesToRecommend = uniqueDisplayedCourseCodes.filter((code) =>
        evaluatedCourses.some(
          (course) =>
            course.course_reco.toUpperCase().replace(/\s/g, "") ===
              code.toUpperCase().replace(/\s/g, "") &&
            course.student_number === studentNumber
        )
      );

      console.log("Evaluated Courses:", evaluatedCourses);
      console.log("Courses to Recommend:", coursesToRecommend);

      // Initialize a variable to track the total credit units to be recommended
      let totalCreditUnitsToRecommend = 0;
      let remainingCreditUnits = totalCreditUnits - totalRecommendedCreditUnits;

      console.log("Entering recommendation again loop");
      // Recommendation logic for each displayed course
      for (const courseCode of coursesToRecommend) {
        // Check if the course code is in the filtered courses
        const isCourseInFiltered = Object.values(filteredCourses).some(
          (courses) =>
            courses.some((course) => course.course_code === courseCode)
        );

        console.log(
          `Course ${courseCode} in filtered courses: ${isCourseInFiltered}`
        );

        // Check if the course already has a date_eval

        const hasDateEval = evaluatedCourses.some(
          (course) =>
            course.course_reco.toUpperCase().replace(/\s/g, "") ===
              courseCode.toUpperCase().replace(/\s/g, "") &&
            course.student_number === studentNumber &&
            course.date_eval !== null
        );

        console.log("HasDateEval:", hasDateEval);
        console.log("AllowRecommend Again,", allowRecommendAgain);

        if ((isCourseInFiltered && !hasDateEval) || allowRecommendAgain) {
          console.log(`Recommendation logic for ${courseCode} is executing`);
          // Fetch the course details to get its credit units
          const courseDetailsResponse = await axios.get(
            `${endPoint}/curriculum/${courseCode}`
          );

          const courseDetails = courseDetailsResponse.data;
          console.log(
            `Credit Units for ${courseCode}:`,
            courseDetails.credit_unit
          );

          if (
            !allowOverload &&
            courseDetails.credit_unit > remainingCreditUnits
          ) {
            // Show a toast indicating that recommending this course exceeds the remaining credit units
            toast({
              title: "Exceeded Remaining Credit Units",
              description: `Recommendation for ${courseCode} exceeds the remaining credit units.`,
              status: "warning",
              duration: 5000,
              isClosable: true,
            });
            continue; // Skip to the next iteration if credit units exceeded
          }

          // Update the currentDate state with the current date
          const today = new Date();
          const formattedDate = `${today.getFullYear()}-${
            today.getMonth() + 1
          }-${today.getDate()}`;

          setEvaluationDate(formattedDate);
          setSelectedCourseCode(courseCode);

          setRecommendedDates((prevDates) => ({
            ...prevDates,
            [courseCode]: formattedDate,
          }));
          console.log("Total Credit Units before post:", totalCreditUnits);

          // Send the date along with other data to the server
          await axios.post(`${endPoint}/evaluate`, {
            course_reco: courseCode,
            evalcredit_unit: courseDetails.credit_unit,
            requiredcredit_unit: totalCreditUnits,
            faculty_id: facultyId,
            student_number: studentNumber,
            date_eval: formattedDate,
            eval_year: evalYearValue,
            eval_sem: evalSemValue,
          });
          console.log(`Recommendation for ${courseCode} completed`);

          // Accumulate the credit units properly
          remainingCreditUnits -= courseDetails.credit_unit;

          // Display a success message for each recommendation
          await toast({
            title: "Course Recommended",
            description: `Course ${courseCode} has been recommended successfully.`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          console.log(`Skipping ${courseCode}`);
          await toast({
            title: "Course Already Recommended",
            description: `Course ${courseCode} has already been recommended.`,
            status: "warning",
            duration: 5000,
            isClosable: true,
          });
        }
      }
      console.log(
        "Final Total Credit Units To Recommend:",
        totalCreditUnitsToRecommend
      );
      console.log("Total Credit Units:", totalCreditUnits);

      if (totalCreditUnitsToRecommend > totalCreditUnits) {
        // Show a toast indicating that the total recommended credit units exceed the remaining credit units
        toast({
          title: "Exceeded Remaining Credit Units",
          description:
            "Total recommended credit units exceed the remaining credit units.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        return; // Stop the function execution
      }

      // Update the totalRecommendedCreditUnits with the computed credit units
      setTotalRecommendedCreditUnits(totalCreditUnits - remainingCreditUnits);

      // Clear the displayed course codes after recommendations
      setDisplayedCourseCodes([]);
    } catch (error) {
      // Handle the error (you can use a toast or any other method)
      toast({
        title: "Error Recommending Course",
        description: "There was an error recommending the course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      console.error("Error recommending course:", error);
    }
  };
  useEffect(() => {}, [allowRecommendAgain]);
  console.log("filteredCourses:", filteredCourses);

  const getYearText = (numericYear) => {
    switch (numericYear) {
      case 1:
        return "First";
      case 2:
        return "Second";
      case 3:
        return "Third";
      case 4:
        return "Fourth";
      case 0:
        return "Bridging";
      default:
        return ""; // You can adjust this based on your needs
    }
  };
  const handleViewAnalytics = () => {
    setShowAnalytics(true);
  };

  return (
    <Box w="90%">
      {showAnalytics ? (
        <StudentAnalytics
          studentNumber={studentNumber}
          evalYearValue={evalYearValue}
          evalSemValue={evalSemValue}
        />
      ) : (
        <Flex mt="5rem" overflow="hidden" flexDirection="column" w="100%">
          <HStack
            w="90%"
            spacing={{ base: "1rem", sm: "2rem" }}
            justifyContent={{ base: "center", sm: "flex-start" }}
            flexWrap="wrap"
            ml={{ base: "0rem", md: "3rem", lg: "2rem" }}
          >
            <Button
              bg="#E3B04B"
              width={{ base: "8rem", md: "10rem", lg: "12rem" }}
              onClick={handleViewAnalytics}
              _hover={{ bg: "#FFD966", transition: "background-color 0.3s" }}
              ml={{ base: "2rem", md: "12rem", lg: "3rem" }}
            >
              View Analytics
            </Button>

            <Box ml={{ base: "2rem", md: "auto", lg: "auto" }}>
              <HStack spacing={4}>
                <VStack
                  align="start"
                  spacing={2}
                  w={{ base: "100%", md: "auto" }}
                >
                  <Select
                    size="sm"
                    color="gray.500"
                    width={{ base: "8rem", md: "8rem", lg: "10rem" }}
                    placeholder="Select Semester"
                    value={selectedSemester}
                    onChange={(event) =>
                      setSelectedSemester(event.target.value)
                    }
                  >
                    <option value="First Semester">First Semester</option>
                    <option value="Second Semester">Second Semester</option>
                    <option value="Summer Semester">Summer Semester</option>
                    <option value="Bridging">Bridging</option>
                    <option value="All Semester">All Semester</option>
                  </Select>
                </VStack>

                <VStack
                  align="start"
                  spacing={2}
                  w={{ base: "100%", md: "auto" }}
                >
                  <Select
                    size="sm"
                    width={{ base: "6rem", md: "8rem", lg: "10rem" }}
                    color="gray.500"
                    placeholder="Select Year"
                    value={selectedYear}
                    onChange={(event) => setSelectedYear(event.target.value)}
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="All Years">All Years</option>
                    <option value="Bridging">Briging Years</option>
                  </Select>
                </VStack>
              </HStack>
            </Box>
          </HStack>

          <Text
            mt="2rem"
            fontSize="19px"
            fontWeight="bold"
            textAlign="left"
            ml={{ base: "1rem", md: "2rem", lg: "5rem" }}
          >
            {programName}
          </Text>
          <HStack mt="2rem" ml={{ base: "1rem", md: "3rem", lg: "5rem" }}>
            <HStack>
              <Text fontSize="17.5px" fontWeight="semibold">
                {" "}
                Evaluating Student for:
              </Text>
              <Text
                fontWeight="semibold"
                fontSize="19px"
                fontStyle="Bitter"
                textAlign="center"
              >
                {`${getYearText(parseInt(evalYearValue))} Year `}
                {""}
                {evalSemValue}
              </Text>
            </HStack>
          </HStack>

          <HStack
            mt="1rem"
            gap="23"
            ml={{ base: "1rem", md: "3rem", lg: "5rem" }}
          >
            <Text fontSize="17.5px" fontWeight="semibold">
              Student Name:
            </Text>
            <Text
              fontWeight="md"
              fontSize="18px"
              fontStyle="Bitter"
              textAlign="center"
            >
              {capitalizeWords(studentData.first_name)}{" "}
              {capitalizeWords(studentData.middle_name)}{" "}
              {capitalizeWords(studentData.last_name)}
            </Text>
          </HStack>

          <HStack
            w="86%"
            mt="1rem"
            ml={{ base: "1rem", md: "3rem", lg: "5rem" }}
          >
            <HStack>
              <Text fontSize="17.5px" fontWeight="semibold">
                Total Credit Units Required{" "}
              </Text>

              <Text>{totalCreditUnits} Units</Text>
            </HStack>
            <VStack ml={{ base: "5%", md: "10%", lg: "auto" }}>
              <HStack>
                <Text
                  fontSize={{ base: "15px", md: "17.5px" }}
                  fontWeight="semibold"
                >
                  Total Units Recommended:
                </Text>
                <Text>
                  {totalRecommendedCreditUnits != null &&
                  totalRecommendedCreditUnits !== 0
                    ? `${totalRecommendedCreditUnits} Unit(s)`
                    : "0 Unit(s)"}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <HStack
            mt={{ base: "1rem", md: "2rem" }}
            ml={{ base: "0rem", md: "40%", lg: "auto" }}
            mr={{ base: "0rem", md: "40%", lg: "auto" }}
          >
            <Button
              bg="#740202"
              color="white"
              width={{ base: "100%", md: "12rem" }}
              onClick={() => setAllowOverload(!allowOverload)}
              _hover={{ bg: "#A93226", transition: "background-color 0.3s" }}
            >
              {allowOverload ? "Deny Overload" : "Allow Overload"}
            </Button>
            <Button
              bg="#740202"
              color="white"
              fontSize={{ base: "12px", md: "15px" }}
              width={{ base: "100%", md: "12rem" }}
              onClick={() => {
                setAllowRecommendAgain(!allowRecommendAgain);
                console.log(
                  "allowRecommendAgain is now:",
                  !allowRecommendAgain
                );
              }}
              _hover={{ bg: "#A93226", transition: "background-color 0.3s" }}
            >
              {allowRecommendAgain ? "Deny Recommend Again" : "Recommend Again"}
            </Button>
          </HStack>

          <Wrap>
            {Object.keys(filteredCourses).map((key) => {
              const filteredCourseItems = filteredCourses[key];
              const [courseYear, , courseSem] = key.split(" ");

              // const hasUnvalidatedCourses = filteredCourseItems.some(
              //   (courseItem) => !validatedCourses.includes(courseItem.course_code)
              // );
              console.log("Course Year", courseYear);

              let originalSchoolYearStart = parseInt(
                studentNumber.substring(0, 4)
              );
              let schoolYearStart = originalSchoolYearStart;
              let schoolYearEnd;

              if (courseYear === "1") {
                schoolYearEnd = schoolYearStart + 1;
              } else if (courseYear === "2") {
                schoolYearStart = originalSchoolYearStart + 1;
                schoolYearEnd = schoolYearStart + 1;
              } else if (courseYear === "3") {
                schoolYearStart = originalSchoolYearStart + 2;
                schoolYearEnd = schoolYearStart + 1;
              } else if (courseYear === "4") {
                schoolYearStart = originalSchoolYearStart + 3;
                schoolYearEnd = schoolYearStart + 1;
              } else {
                schoolYearEnd = schoolYearStart + 5;
              }

              const schoolYear = `${schoolYearStart}-${schoolYearEnd}`;

              if (filteredCourseItems.length > 0) {
                let totalLectureHours = 0;
                let totalLabHours = 0;
                let totalCourseCredits = 0;

                return (
                  <div key={key}>
                    <VStack
                      mt={{ base: "2rem", md: "3rem", lg: "4rem" }}
                      spacing="1"
                      align="flex-start"
                      w="80vw"
                      ml={{ base: "2rem", md: "2rem", lg: "2rem" }}
                    >
                      <HStack ml={{ base: "0rem", md: "2rem", lg: "3rem" }}>
                        <Text
                          fontSize={{ base: "15px", md: "17.5px" }}
                          fontWeight="semibold"
                        >
                          Year Level:
                        </Text>
                        <Text
                          fontWeight="md"
                          fontSize={{ base: "15px", md: "17.5px" }}
                        >
                          {`${getYearText(parseInt(courseYear))} Year `}
                        </Text>
                      </HStack>

                      <HStack ml={{ base: "0rem", md: "2rem", lg: "3rem" }}>
                        <Text
                          fontSize={{ base: "15px", md: "17.5px" }}
                          fontWeight="semibold"
                        >
                          Semester:
                        </Text>
                        <Text
                          fontWeight="md"
                          fontSize={{ base: "15px", md: "17.5px" }}
                        >
                          {selectedSemester === "Bridging"
                            ? "Bridging"
                            : `${capitalizeWords(courseSem)} Semester`}
                        </Text>
                      </HStack>
                      <HStack ml={{ base: "0rem", md: "2rem", lg: "3rem" }}>
                        <Text
                          fontSize={{ base: "15px", md: "17.5px" }}
                          fontWeight="semibold"
                        >
                          School Year:
                        </Text>
                        <Text fontSize={{ base: "15px", md: "17.5px" }}>
                          {schoolYear}
                        </Text>
                      </HStack>

                      <Button
                        onClick={() => setShowCheckboxes(!showCheckboxes)}
                        ml={{ base: "0rem", md: "2rem", lg: "3rem" }}
                        bg="#740202"
                        color="white"
                        justifyContent="flex-end"
                        _hover={{
                          bg: "#A93226",
                          transition: "background-color 0.3s",
                        }}
                      >
                        Recommend {showCheckboxes ? "All" : "Few"}
                      </Button>
                    </VStack>
                    <Flex w="90vw" overflow="visible">
                      <VStack w="95%">
                        <TableContainer w="90%" mt="1rem">
                          <Table
                            variant="simple"
                            fontFamily="inter"
                            size="sm"
                            overflowX="auto"
                          >
                            <Thead bg="palette.primary" h="5rem">
                              <Tr>
                                {showCheckboxes && <Th></Th>}
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Course Code
                                </Th>
                                <Th
                                  style={{ textAlign: "center" }}
                                  color="palette.secondary"
                                >
                                  Course Title
                                </Th>
                                <Th color="palette.secondary">
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
                                  Date
                                </Th>
                                <Th></Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredCourseItems.map((courseItem) => {
                                totalLectureHours += courseItem.num_lecture;
                                totalLabHours += courseItem.num_lab;
                                totalCourseCredits += courseItem.credit_unit;
                                displayedCourseCodes.push(
                                  courseItem.course_code
                                );
                                return (
                                  <Tr key={courseItem.course_code}>
                                    {showCheckboxes && (
                                      <Td>
                                        <Checkbox
                                          size="md"
                                          colorScheme="green"
                                          isChecked={selectedCourses[
                                            currentSemester
                                          ]?.includes(courseItem.course_code)}
                                          onChange={(e) =>
                                            handleCheckboxChange(
                                              e,
                                              courseItem.course_code
                                            )
                                          }
                                        ></Checkbox>
                                      </Td>
                                    )}
                                    <Td>{courseItem.course_code}</Td>
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
                                    <Td
                                      fontSize="14px"
                                      fontStyle="bitter"
                                      style={{ textAlign: "center" }}
                                    >
                                      {recommendedDates[courseItem.course_code]
                                        ? new Date(
                                            recommendedDates[
                                              courseItem.course_code
                                            ]
                                          ).toLocaleDateString()
                                        : ""}
                                    </Td>
                                    <Td></Td>
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
                                {showCheckboxes && <Th></Th>}
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
                                <Th></Th>
                              </Tr>
                            </Tfoot>
                          </Table>
                        </TableContainer>
                      </VStack>
                    </Flex>
                  </div>
                );
              }

              return null;
            })}
          </Wrap>

          {displayedCourseCodes.length > 0 && (
            <React.Fragment>
              <Button
                mt="2rem"
                bg="#740202"
                color="white"
                textAlign="center"
                w="90%"
                onClick={() => {
                  if (showCheckboxes) {
                    // If checkboxes are visible, recommend only selected courses
                    setRecommendFew(true);
                    recommendSelectedCourses();
                  } else if (allowRecommendAgain) {
                    handleRecommendAgain();
                  } else {
                    setRecommendFew(false);
                    handleRecommendAll();
                  }
                }}
                ml={{ base: "2rem", md: "3rem", lg: "5rem" }}
                _hover={{ bg: "#A93226", transition: "background-color 0.3s" }}
              >
                Recommend {showCheckboxes ? "Selected" : "All"}
              </Button>
            </React.Fragment>
          )}
        </Flex>
      )}
      {/* <Notice
        filterExcludedCourses={() =>
          filterExcludedCourses(evalYearValue, evalSemValue)
        }
        year={evalYearValue}
        semester={evalSemValue}
        studentNumber={studentNumber}
      /> */}
      {/* <GradeofFive
        filterCourses={filterCourses}
        studentNumber={studentNumber}
      /> */}
    </Box>
  );
}

UsersEvaluation.propTypes = {
  studentNumber: PropTypes.string.isRequired,

  evalYearValue: PropTypes.string.isRequired,
  evalSemValue: PropTypes.string.isRequired,
};

export default UsersEvaluation;
