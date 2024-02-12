import {
  Button,
  Flex,
  HStack,
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
import { endPoint } from "../../config";
import GradesModal from "./gradesModal";
import "./usersDataStyle.css";

function UsersData({ studentNumber, facultyId, program, strand }) {
  const [curriculumMap, setCurriculumMap] = useState(new Map());
  const [programName, setProgramName] = useState("");
  console.log("Received Student Number in UserData:", studentNumber);
  const [, forceUpdate] = React.useState();
  // console.log("Received FacultyID:", facultyId);
  console.log("Program:", program);
  console.log("Strand:", strand);
  console.log(
    "Conditions met:",
    studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019"),
    program === "1",
    !(strand === "STEM" || strand === "ICT")
  );

  const toast = useToast();
  const [courses, setCourses] = useState([]);

  const [gradesAndRemarks, setGradesAndRemarks] = useState(
    courses.map((course) => ({
      course_code: course.course_code,
      grades: null, // Initialize with a numeric value
      remarks: "",
    }))
  );
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  const [courseCodesWithoutPrerequisites, setCourseCodesWithoutPrerequisites] =
    useState([]);
  const [validationData, setValidationData] = useState([]);
  const [courseCodesWithGrades, setCourseCodesWithGrades] = useState([]);
  const [editedCourse, setEditedCourse] = useState(null);
  const [isGradesModalOpen, setIsGradesModalOpen] = useState(false);
  const [studentData, setStudentData] = useState({});
  const [newGradesAndRemarks, setNewGradesAndRemarks] = useState({
    newGrades: "",
    newRemarks: "",
  });
  const [keyForRerender, setKeyForRerender] = useState(0);

  const [grades, setGrades] = useState({});
  const [prerequisiteCourses, setPrerequisiteCourses] = useState([]);
  const [prerequisiteCoursesWithGrades, setPrerequisiteCoursesWithGrades] =
    useState([]);

  const [editable, setEditable] = useState({});
  const [courseType, setCourseType] = useState();

  const [disabledCourses, setDisabledCourses] = useState({});
  const [courseCodePrerequisite, setCourseCodePrerequisite] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [
    withoutPrerequisiteWithGrades,
    setwithoutPrerequisiteCoursesWithGrades,
  ] = useState([]);

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
        //console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();

    console.log("Fetching student data complete.");
  }, [studentNumber]);

  const getCourseType = (studentNumber) => {
    if (studentNumber.startsWith("2020") || studentNumber.startsWith("2021")) {
      return 2019;
    } else {
      // Handle any other cases or provide a default value
      return 2022;
    }
  };
  //curriculum
  useEffect(() => {
    const currentCourseType = getCourseType(studentNumber);
    axios
      .get(
        `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
      )
      .then((res) => {
        const courseData = res.data;

        const newCurriculumMap = new Map(
          courseData.map((course) => [course.course_code, course.course_title])
        );
        console.log("Curriculum Map:", newCurriculumMap);
        setCurriculumMap(newCurriculumMap);

        // Filter courses for course_year=3 and course_sem=Second Semester
        const coursesWithoutPrerequisites = courseData.filter(
          (course) =>
            course.course_year === 3 &&
            course.course_sem === "Second Semester" &&
            (!course.pre_requisite || course.pre_requisite.trim() === "")
        );

        // Get the course codes for courses without prerequisites
        const courseCodesWithoutPrerequisites = coursesWithoutPrerequisites.map(
          (course) => course.course_code
        );

        // Store course codes without prerequisites in local state
        setCourseCodesWithoutPrerequisites(courseCodesWithoutPrerequisites);

        const prerequisiteCourseCodes = courseData
          .filter(
            (course) =>
              course.pre_requisite && course.pre_requisite.trim() !== ""
          )
          .map((course) =>
            course.pre_requisite.split(",").map((code) => code.trim())
          )
          .flat();

        setPrerequisiteCourses((prevCourses) => {
          console.log("Prerequisite Course Codes:", prerequisiteCourseCodes);
          return prerequisiteCourseCodes;
        });

        // Declare coursesWithGrades here
        const coursesWithGrades = courseData.filter(
          (courseItem) => grades[courseItem.course_code] !== undefined
        );

        const disabledCourses = {};
        coursesWithGrades.forEach((courseItem) => {
          const { course_code } = courseItem;
          disabledCourses[course_code] = true;
        });

        // Update the disabledCourses state
        setDisabledCourses(disabledCourses);
        // Update the editable state based on the disabled courses
        setEditable((prevEditable) => {
          const updatedEditable = { ...prevEditable };
          Object.keys(updatedEditable).forEach((courseCode) => {
            updatedEditable[courseCode] = !disabledCourses[courseCode];
          });
          return updatedEditable;
        });
        // Filter and check prerequisites
        // const prerequisiteCoursesWithGrades = courseData
        //   .filter(
        //     (course) =>
        //       course.pre_requisite && course.pre_requisite.trim() !== ""
        //   )
        //   .map((course) => {
        //     const prerequisiteCode = course.pre_requisite.trim();
        //     const hasGrades = coursesWithGrades.some(
        //       (courseWithGrades) =>
        //         courseWithGrades.course_code === prerequisiteCode
        //     );
        //     console.log(
        //       "Course Code:",
        //       course.course_code,
        //       "Prerequisite Code:",
        //       prerequisiteCode
        //     );
        //     return {
        //       code: prerequisiteCode,
        //       hasGrades,
        //     };
        //   });

        // Initialize gradesAndRemarks state with empty values
        const initialGradesAndRemarks = courseData.map((courseItem) => ({
          course_code: courseItem.course_code,
          grades: "",
          remarks: "",
        }));

        setCourses(courseData);
        setGradesAndRemarks(initialGradesAndRemarks);

        const courseCodesWithGrades = initialGradesAndRemarks
          .filter((item) => item.grades !== "")
          .map((item) => item.course_code);

        setCourseCodesWithGrades(courseCodesWithGrades);
      })

      .catch((error) => {
        console.error("Error fetching course data:", error);
      })
      .finally(() => {
        console.log("Fetching curriculum done.");
      });
  }, [grades, program, studentNumber]);

  useEffect(() => {
    console.log(
      "Courses in 3rd year 2nd sem without prereq",
      courseCodesWithoutPrerequisites
    );
  }, [courseCodesWithoutPrerequisites]);

  useEffect(() => {
    // This useEffect is now after the fetchGradesAndPrerequisites, ensuring that the state is updated
    if (!isLoading) {
      // This useEffect is now after the fetchGradesAndPrerequisites, ensuring that the state is updated
      console.log(
        "Prerequisite Courses from the state that have grades:",
        prerequisiteCoursesWithGrades
      );
    }
  }, [isLoading, prerequisiteCoursesWithGrades]);
  //fetch grade
  async function fetchGrades(
    studentNumber,
    program,
    strand,
    courses,
    setGradesAndRemarks,
    setPrerequisiteCoursesWithGrades
  ) {
    try {
      const currentCourseType = getCourseType(studentNumber);
      console.log("Fetching grades for studentNumber:", studentNumber);
      const response = await axios.get(
        `${endPoint}/grades?studentNumber=${studentNumber}`
      );

      const gradesData = response.data;
      console.log("Fetched grades data:", gradesData);

      // Fetch course codes from the curriculum endpoint
      const curriculumResponse = await axios.get(
        `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
      );
      console.log("Fetched curriculum data:", curriculumResponse.data);

      const courseCodeMap = {};
      curriculumResponse.data.forEach((course) => {
        courseCodeMap[course.course_id] = course.course_code;
      });
      console.log("Course Code Map:", courseCodeMap);

      const initialGradesAndRemarks = courses.map((courseItem) => ({
        course_code: courseCodeMap[courseItem.course_id],
        grades: "",
        remarks: "",
      }));
      console.log(
        "Before updating grades and remarks:",
        initialGradesAndRemarks
      );

      // Now, update the grades and remarks based on the fetched data
      gradesData.forEach((grade) => {
        const index = initialGradesAndRemarks.findIndex(
          (item) => item.course_code === courseCodeMap[grade.course_id]
        );
        if (index !== -1) {
          // Convert course_id to course_code
          const courseCode = courseCodeMap[grade.course_id];

          initialGradesAndRemarks[index] = {
            ...initialGradesAndRemarks[index],
            ...grade,
            course_code: courseCode,
          };
          console.log(`Course code ${courseCode} has grades.`);
        }
      });
      console.log("Updated grades and remarks:", initialGradesAndRemarks);

      // Process prerequisites
      const newPrerequisites = {};

      courses.forEach((course) => {
        const course_code = course.course_code;

        // Check if the course or its prerequisites have grades
        const hasGrades =
          initialGradesAndRemarks.some(
            (item) => item.course_code === course_code
          ) ||
          course.prerequisites.some((prerequisite) =>
            initialGradesAndRemarks.some(
              (item) => item.course_code === prerequisite
            )
          );

        newPrerequisites[course_code] = hasGrades;
      });

      // Filter only the prerequisite courses with grades
      const getprerequisiteCoursesWithGrades = Object.keys(newPrerequisites)
        .filter(
          (courseCode) =>
            Array.isArray(prerequisiteCourses) &&
            prerequisiteCourses.includes(courseCode)
        )
        .reduce((filteredPrerequisites, courseCode) => {
          // Check if the prerequisite course code itself has grades
          const hasGrades = initialGradesAndRemarks.some(
            (item) => item.course_code === courseCode && item.grades !== ""
          );

          // Add to the filtered prerequisites if it has grades
          if (hasGrades) {
            filteredPrerequisites[courseCode] = true;
          }

          return filteredPrerequisites;
        }, {});

      // console.log(
      //   "Final Prerequisite Courses with grades:",
      //   getprerequisiteCoursesWithGrades
      // );
      const arrayPrerequisiteCoursesWithGrades = Object.keys(
        getprerequisiteCoursesWithGrades
      );

      setPrerequisiteCoursesWithGrades(arrayPrerequisiteCoursesWithGrades);
      console.log(
        "Prerequisite Courses with grades (immediately after setting):",
        arrayPrerequisiteCoursesWithGrades
      );

      const getwithoutPrerequisiteCoursesWithGrades = Object.keys(
        newPrerequisites
      )
        .filter(
          (courseCode) =>
            Array.isArray(courseCodesWithoutPrerequisites) &&
            courseCodesWithoutPrerequisites.includes(courseCode)
        )
        .reduce((filteredPrerequisites, courseCode) => {
          // Check if the prerequisite course code itself has grades
          const hasGrades = initialGradesAndRemarks.some(
            (item) => item.course_code === courseCode && item.grades !== ""
          );

          // Add to the filtered prerequisites if it has grades
          if (hasGrades) {
            filteredPrerequisites[courseCode] = true;
          }

          return filteredPrerequisites;
        }, {});

      const arraywithoutPrerequisiteCoursesWithGrades = Object.keys(
        getwithoutPrerequisiteCoursesWithGrades
      );

      setwithoutPrerequisiteCoursesWithGrades(
        arraywithoutPrerequisiteCoursesWithGrades
      );

      // console.log("Final Prerequisite Courses with grades:", prerequisiteCoursesWithGrades);

      // console.log(
      //   "Total Prerequisite Courses:",
      //   Object.values(prerequisiteCoursesWithGrades).filter(Boolean).length
      // );

      gradesData.forEach((gradeData) => {
        const { course_code, prerequisites: coursePrerequisites } = gradeData;

        const prerequisitesArray = (coursePrerequisites || "")
          .split(",")
          .flatMap((prerequisite) => prerequisite.split(" "))
          .map((p) => p.trim())
          .filter(Boolean);

        newPrerequisites[course_code] = true;

        if (coursePrerequisites) {
          for (const prerequisite of prerequisitesArray) {
            const hasGrade =
              initialGradesAndRemarks.find(
                (item) => item.course_code === prerequisite
              ) !== undefined;

            // console.log(
            //   `Prerequisite ${prerequisite} has grade: ${hasGrade}, Grade: ${gradeData.grades[prerequisite]}`
            // );

            if (!hasGrade) {
              console.log(
                `Setting ${course_code} prerequisites status to false due to missing grade for ${prerequisite}.`
              );
              newPrerequisites[course_code] = false;
              break;
            }
          }
        }
      });

      setGradesAndRemarks(initialGradesAndRemarks);

      return { initialGradesAndRemarks, newPrerequisites };
    } catch (error) {
      console.error("Error fetching grades:", error);
    }
  }

  useEffect(() => {
    const fetchGradesAndPrerequisites = async () => {
      try {
        const { initialGradesAndRemarks } = await fetchGrades(
          studentNumber,
          program,
          strand,
          courses,
          setGradesAndRemarks,
          setPrerequisiteCoursesWithGrades
        );

        setGradesAndRemarks(initialGradesAndRemarks);
        setIsLoading(false); // Set loading to false once data is fetched and processed

        // Continue updating other state variables as needed
      } catch (error) {
        console.error("Error fetching grades and prerequisites:", error);
        setIsLoading(false); // Set loading to false even in case of an error
      }
    };

    fetchGradesAndPrerequisites();
  }, [studentNumber, program, strand, courses]);

  //fetch curriculm and its prerequisite
  useEffect(() => {
    const currentCourseType = getCourseType(studentNumber);
    const fetchCousePrerequisiteData = async () => {
      console.log("CourseType inside the useEffect2:", courseType);
      try {
        const response = await fetch(
          `${endPoint}/curriculum-prerequisite?program_id=${program}&year_started=${currentCourseType}`
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
  }, [courseType, program, studentNumber]);

  useEffect(() => {
    console.log("Fetching data from API...");

    // console.log("Prerequisite Courses from the state:", prerequisiteCourses);
    // console.log("Data fetched and states updated.");
  }, [prerequisiteCourses, prerequisiteCoursesWithGrades]);

  useEffect(() => {}, [withoutPrerequisiteWithGrades]);

  const handleGradesSaved = () => {
    fetchGrades(
      studentNumber,
      program,
      strand,
      courses,
      setGradesAndRemarks,
      setPrerequisiteCoursesWithGrades
    );
  };

  const handleEditCourse = (course) => {
    console.log("Editing course:", course);
    console.log("Edit button clicked for course:", course);

    // Check if the edit button should be disabled

    const existingCourse = gradesAndRemarks.find(
      (item) => item.course_code === course.course_code
    );

    setEditedCourse(course);
    setIsGradesModalOpen(true);

    if (existingCourse) {
      setNewGradesAndRemarks({
        newGrades: existingCourse.grades,
        newRemarks: existingCourse.remarks,
      });
    } else {
      setNewGradesAndRemarks({
        newGrades: "",
        newRemarks: "",
      });
    }
  };

  const handleGradesModalClose = () => {
    setIsGradesModalOpen(false);
  };
  // useEffect(() => {
  //   // Use prerequisiteCoursesWithGrades here after it's updated
  //   console.log(
  //     "Updated Prerequisite Courses with grades:",
  //     prerequisiteCoursesWithGrades
  //   );
  // }, [prerequisiteCoursesWithGrades]);

  function formatValidatedDate(date) {
    if (!date) return "Not Validated";

    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString(); // You can customize the date format as per your requirements
  }

  useEffect(() => {
    console.log("Validation Data", validationData);
  }, [validationData]);

  //get validate base on studentnumber
  useEffect(() => {
    axios
      .get(`${endPoint}/validate`, {
        params: {
          student_number: studentNumber,
        },
      })
      .then((res) => {
        const validationData = res.data;
        setValidationData(validationData);
      })
      .catch((error) => {
        console.error("Error fetching validation data:", error);
      });
  }, [studentNumber, keyForRerender]);

  const updateAnalysisData = async (
    studentNumber,
    program,
    strand,
    courses,
    gradesAndRemarks
  ) => {
    // Set the total remaining units to 167
    // let totalCreditUnits = 167;

    for (const gradeData of gradesAndRemarks) {
      const { grades } = gradeData;

      if (grades !== null) {
        // Update the remaining units for the course
        // const course = courses.find((c) => c.course_code === course_code);
        // if (course) {
        //   totalCreditUnits -= parseFloat(course.credit_unit || 0);
        // }
      }
    }

    // Prepare the data to send in the PUT request
    // const analysisData = {
    //   student_number: studentNumber,
    //   program: program,
    //   strand: strand,
    //   remaining_units: totalCreditUnits,
    //   grade_id: gradesAndRemarks.map((gradeData) => gradeData.grade_id),
    // };

    try {
      // Send a PUT request to update the analysis data
      // const response = await axios.put(
      //   "http://localhost:3000/analysis",
      //   analysisData
      // );
      // if (response.status === 200) {
      //   console.log("Analysis data updated successfully");
      // } else {
      //   console.error("Failed to update analysis data");
      // }
    } catch (error) {
      console.error("Error updating analysis data:", error);
    }
  };

  const getFormattedDate = () => {
    const currentDate = new Date();
    const options = {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour12: false,
    };
    const formatter = new Intl.DateTimeFormat("en-US", options);
    return formatter.format(currentDate);
  };
  // let formattedDate = "";

  // const handleValidateCourse = async (filteredCourseItems) => {
  //   try {
  //     const studentNumber = studentData.student_number;

  //     const coursesWithGrades = filteredCourseItems.filter((courseItem) => {
  //       const gradesAndRemark = gradesAndRemarks.find(
  //         (item) => item.course_code === courseItem.course_code
  //       );
  //       return gradesAndRemark && gradesAndRemark.grades !== "";
  //     });

  //     const dataToValidate = await Promise.all(
  //       coursesWithGrades.map(async (courseItem) => {
  //         try {
  //           const gradesAndRemark = gradesAndRemarks.find(
  //             (item) => item.course_code === courseItem.course_code
  //           );

  //           const undesiredGrades = ["5", "-1", "Incomplete", "0", "Withdraw"];

  //           if (
  //             gradesAndRemark &&
  //             undesiredGrades.includes(gradesAndRemark.grades?.toString())
  //           ) {
  //             console.log(
  //               `Undesired Grade Found: ${gradesAndRemark.grades} for Course ${courseItem.course_code}`
  //             );

  //             // Update the status of the student to "Back Subject"
  //             await updateStudentStatus(studentNumber, "Back Subject");

  //             toast({
  //               title: `Course ${courseItem.course_code} needs to be retaken`,
  //               status: "warning",
  //               duration: 3000,
  //               isClosable: true,
  //             });

  //             console.log("Validation Data:", validationData);
  //             console.log("Filtered Course Items:", filteredCourseItems);
  //             console.log("Grades and Remarks:", gradesAndRemarks);
  //             return null; // Skip the course from further processing
  //           }

  //           const validationEntry = validationData.find(
  //             (entry) => entry.course_code === courseItem.course_code
  //           );

  //           if (!validationEntry || !validationEntry.date_validated) {
  //             let formattedDate = getFormattedDate();

  //             const currentCourseType = getCourseType(studentNumber);
  //             const courseData = await axios.get(
  //               `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
  //             );
  //             const course_id =
  //               courseData.data.find(
  //                 (item) => item.course_code === courseItem.course_code
  //               )?.course_id || null;

  //             return {
  //               student_number: studentNumber,
  //               course_id: course_id,
  //               grade_id:
  //                 gradesAndRemarks.find(
  //                   (item) => item.course_code === courseItem.course_code
  //                 )?.grade_id || null,
  //               date_validated: formattedDate,
  //               faculty_id: facultyId,
  //             };
  //           } else {
  //             return null; // Skip the course from further processing
  //           }
  //         } catch (error) {
  //           console.error("Error preparing data for validation:", error);
  //           // Handle the error as needed, e.g., log and continue processing
  //           return null; // Skip the course from further processing
  //         }
  //       })
  //     );

  //     // Filter out courses that were skipped (returned null)
  //     console.log("Data to validate:", dataToValidate);
  //     const validDataToValidate = dataToValidate.filter((data) => {
  //       console.log("Checking data:", data);
  //       const isValid =
  //         data !== null &&
  //         data.date_validated &&
  //         typeof data.date_validated === "string" &&
  //         data.date_validated.trim() !== "";
  //       console.log("Is data valid?", isValid);
  //       return isValid;
  //     });

  //     // console.log("Valid data to validate:", validDataToValidate);

  //     // if (validDataToValidate.length === 0) {
  //     //   toast({
  //     //     title: "No courses with grades to validate",
  //     //     status: "info",
  //     //     duration: 3000,
  //     //     isClosable: true,
  //     //   });
  //     //   return;
  //     // }

  //     console.log("Valid data to validate:", validDataToValidate);

  //     if (validDataToValidate.length > 0) {
  //       const response = await axios.post(
  //         `${endPoint}/validate`,
  //         validDataToValidate
  //       );
  //       console.log("Success toast should display");
  //       if (response.status === 201) {
  //         toast({
  //           title: "Courses validated successfully",
  //           status: "success",
  //           duration: 3000,
  //           isClosable: true,
  //         });

  //         const existingCodes = new Set(
  //           validationData.map((entry) => entry.course_code)
  //         );
  //         const updatedValidationData = validDataToValidate
  //           .filter(
  //             (item) =>
  //               !existingCodes.has(item.course_code) || !item.date_validated
  //           )
  //           .map((item) => ({
  //             course_code: item.course_code,
  //             date_validated: item.date_validated,
  //           }));

  //         updateAnalysisData(
  //           studentNumber,
  //           program,
  //           strand,
  //           courses,
  //           gradesAndRemarks
  //         );
  //         setValidationData([...validationData, ...updatedValidationData]);
  //         setKeyForRerender((prevKey) => prevKey + 1);
  //       } else {
  //         toast({
  //           title: "Failed to validate courses",
  //           status: "error",
  //           duration: 3000,
  //           isClosable: true,
  //         });
  //       }
  //     } else {
  //       toast({
  //         title: "No courses with grades to validate",
  //         status: "info",
  //         duration: 3000,
  //         isClosable: true,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error validating courses:", error);
  //     if (error.response) {
  //       console.error("Server responded with data:", error.response.data);
  //       console.error("Status code:", error.response.status);
  //       console.error("Headers:", error.response.headers);
  //     } else if (error.request) {
  //       console.error("No response received. Request details:", error.request);
  //     } else {
  //       console.error("Error details:", error.message);
  //     }
  //     toast({
  //       title: "An error occurred while validating courses",
  //       description: error.message,
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //     });
  //   }
  // };

  const handleValidateCourse = async (filteredCourseItems) => {
    try {
      const studentNumber = studentData.student_number;

      const coursesWithGrades = filteredCourseItems.filter((courseItem) => {
        const gradesAndRemark = gradesAndRemarks.find(
          (item) => item.course_code === courseItem.course_code
        );
        return gradesAndRemark && gradesAndRemark.grades !== "";
      });

      const dataToValidate = await Promise.all(
        coursesWithGrades.map(async (courseItem) => {
          try {
            const gradesAndRemark = gradesAndRemarks.find(
              (item) => item.course_code === courseItem.course_code
            );

            const undesiredGrades = ["5", "-1", "Incomplete", "0", "Withdraw"];

            if (
              gradesAndRemark &&
              undesiredGrades.includes(gradesAndRemark.grades?.toString())
            ) {
              console.log(
                `Undesired Grade Found: ${gradesAndRemark.grades} for Course ${courseItem.course_code}`
              );

              // Update the status of the student to "Back Subject"
              await updateStudentStatus(studentNumber, "Back Subject");

              toast({
                title: `Course ${courseItem.course_code} needs to be retaken`,
                status: "warning",
                duration: 3000,
                isClosable: true,
              });

              console.log("Validation Data:", validationData);
              console.log("Filtered Course Items:", filteredCourseItems);
              console.log("Grades and Remarks:", gradesAndRemarks);
              return null; // Skip the course from further processing
            }

            const validationEntry = validationData.find(
              (entry) => entry.course_code === courseItem.course_code
            );

            if (!validationEntry || !validationEntry.date_validated) {
              let formattedDate = getFormattedDate();

              const currentCourseType = getCourseType(studentNumber);
              const courseData = await axios.get(
                `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
              );
              const course_id =
                courseData.data.find(
                  (item) => item.course_code === courseItem.course_code
                )?.course_id || null;

              return {
                course_code: courseItem.course_code, // Include course_code for filtering
                student_number: studentNumber,
                course_id: course_id,
                grade_id: gradesAndRemark?.grade_id || null,
                date_validated: formattedDate,
                faculty_id: facultyId,
              };
            } else {
              return null; // Skip the course from further processing
            }
          } catch (error) {
            console.error("Error preparing data for validation:", error);
            // Handle the error as needed, e.g., log and continue processing
            return null; // Skip the course from further processing
          }
        })
      );

      // Filter out courses that were skipped (returned null) or already validated
      const validDataToValidate = dataToValidate.filter((data) => {
        const isAlreadyValidated = validationData.some(
          (existingEntry) =>
            (existingEntry.course_code === data.course_code ||
              existingEntry.course_id === data.course_id) &&
            existingEntry.date_validated
        );

        const isValid =
          data !== null &&
          !isAlreadyValidated &&
          data.date_validated &&
          typeof data.date_validated === "string" &&
          data.date_validated.trim() !== "";

        return isValid;
      });

      console.log("Valid Data to Validate:", validDataToValidate);

      // ... rest of your code ...

      if (validDataToValidate.length > 0) {
        const response = await axios.post(
          `${endPoint}/validate`,
          validDataToValidate
        );

        console.log("Validation Response:", response);

        if (response.status === 201) {
          const existingCodes = new Set(
            validationData.map((entry) => entry.course_code)
          );

          const updatedValidationData = validDataToValidate
            .filter((item) => {
              const isAlreadyValidated =
                existingCodes.has(item.course_code) &&
                validationData.some(
                  (existingEntry) =>
                    existingEntry.course_code === item.course_code &&
                    existingEntry.date_validated
                );

              return !isAlreadyValidated;
            })
            .map((item) => ({
              course_code: item.course_code,
              date_validated: item.date_validated,
            }));

          if (updatedValidationData.length > 0) {
            updateAnalysisData(
              studentNumber,
              program,
              strand,
              courses,
              gradesAndRemarks
            );
            setValidationData([...validationData, ...updatedValidationData]);
            setKeyForRerender((prevKey) => prevKey + 1);

            toast({
              title: "Courses validated successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "No new courses with grades to validate",
              status: "info",
              duration: 3000,
              isClosable: true,
            });
          }
        } else {
          toast({
            title: "Failed to validate courses",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "No courses with grades to validate",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error validating courses:", error);
      if (error.response) {
        console.error("Server responded with data:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received. Request details:", error.request);
      } else {
        console.error("Error details:", error.message);
      }
      toast({
        title: "An error occurred while validating courses",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateStudentStatus = async (studentNumber, newStatus) => {
    try {
      const response = await axios.put(
        `${endPoint}/students/update-status/${encodeURIComponent(
          studentNumber
        )}`,
        {
          newStatus: newStatus,
        }
      );

      if (response.status === 200) {
        console.log(`Student status updated to ${newStatus}`);
      } else {
        console.error("Failed to update student status");
      }
    } catch (error) {
      console.error("Error updating student status:", error);
    }
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
    "First Summer Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 1 &&
        courseItem.course_sem === "Summer Semester"
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
    "Second Summer Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 2 &&
        courseItem.course_sem === "Summer Semester"
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
    "Fourth Summer Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Summer Semester"
    ),
    "Fourth Second Semester": courses.filter(
      (courseItem) =>
        courseItem.course_year === 4 &&
        courseItem.course_sem === "Second Semester"
    ),
  };

  if (
    (studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019")) &&
    program === 1 &&
    !(strand === "STEM" || strand === "ICT")
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", courses);
    filteredCourses["Bridging"] = courses.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log(
      "Bridging Semester Courses:",
      filteredCourses["Bridging Semester"]
    );
  }

  if (
    !(
      studentNumber.startsWith("2020") ||
      studentNumber.startsWith("2021") ||
      studentNumber.startsWith("2019")
    ) &&
    program === 1 &&
    strand !== "STEM" &&
    strand !== "ICT"
  ) {
    console.log("Adding Bridging Semester...");
    console.log("All Courses:", courses);
    filteredCourses["Bridging"] = courses.filter((courseItem) => {
      return (
        courseItem.course_sem === "Bridging" || courseItem.isBridging === true
      );
    });
    console.log("Bridging Semester Courses:", filteredCourses["Bridging"]);
  }

  //clear
  const deleteGradesForCourse = async (courseCode) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to clear the grades for this course?"
      );

      if (!confirmation) {
        return; // User canceled the operation
      }

      console.log("Deleting grades for student:", studentNumber);
      console.log("Program:", program);

      // Retrieve the course_id for the given courseCode
      const currentCourseType = getCourseType(studentNumber);
      const courseData = await axios.get(
        `${endPoint}/curriculum?program_id=${program}&year_started=${currentCourseType}`
      );

      const courseItem = courseData.data.find(
        (item) => item.course_code === courseCode
      );

      if (!courseItem) {
        console.error(
          `Course with code ${courseCode} not found in curriculum.`
        );
        return;
      }

      const courseId = courseItem.course_id;

      console.log("Deleting grades for course:", courseId);
      // Use courseId to construct the delete request
      console.log(
        "Request URL:",
        `${endPoint}/grades/${studentNumber}/${courseId}`
      );

      // Update state immediately
      setGradesAndRemarks((prevGradesAndRemarks) =>
        prevGradesAndRemarks.filter((item) => item.course_code !== courseCode)
      );

      const response = await axios.delete(
        `${endPoint}/grades/${studentNumber}/${courseId}`
      );
      if (response.status === 200) {
        console.log(`Grades for ${courseCode} cleared successfully.`);
        forceUpdate({});

        setGradesAndRemarks((prevGradesAndRemarks) => {
          const updatedGradesAndRemarks = prevGradesAndRemarks.filter(
            (item) => item.course_code !== courseCode
          );

          console.log("Updated Grades and Remarks:", updatedGradesAndRemarks);

          // Initialize updatedPrerequisiteCoursesWithGrades before using it
          const updatedPrerequisiteCoursesWithGrades = prerequisiteCourses.map(
            (courseCode) => {
              const courseHasGrades = gradesAndRemarks.some(
                (item) => item.course_code === courseCode && item.grades !== ""
              );
              return { courseCode, hasGrades: courseHasGrades };
            }
          );

          setPrerequisiteCoursesWithGrades(
            updatedPrerequisiteCoursesWithGrades
          );

          return updatedGradesAndRemarks;
        });
      } else if (
        response.status === 404 &&
        response.data.message === "Grades not found"
      ) {
        // Handle the case where grades are not found (404)
        console.log(`Grades for ${courseCode} not found. No action needed.`);
      } else {
        console.error("Error clearing grades:", response.statusText);
      }
    } catch (error) {
      console.error("Error clearing grades:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error(
          "Request made but no response was received. Check server availability."
        );
      } else {
        console.error("Error setting up or sending the request.");
      }
    }
  };

  useEffect(() => {
    // Your logic to respond to changes in gradesAndRemarks
    // Also, make sure to include prerequisiteCoursesWithGrades as a dependency
  }, [gradesAndRemarks, prerequisiteCoursesWithGrades]);

  const capitalizeWords = (str) => {
    if (str) {
      return str
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return "";
  };

  const calculateTotalGrades = (filteredCourseItems) => {
    let totalGrades = 0;
    let countCoursesWithGrades = 0;

    filteredCourseItems.forEach((courseItem) => {
      const gradesAndRemark = gradesAndRemarks.find(
        (item) => item.course_code === courseItem.course_code
      );

      if (gradesAndRemark) {
        const grade = parseFloat(gradesAndRemark.grades);

        if (!isNaN(grade) && grade !== -1) {
          totalGrades += grade; // Add the valid grade to the totalGrades
          countCoursesWithGrades++;
        }
      }
    });

    // Now, you can use the totalGrades and countCoursesWithGrades to calculate the average or other statistics.
    // For example, you can calculate the GPA as follows:
    const average =
      countCoursesWithGrades > 0 ? totalGrades / countCoursesWithGrades : 0;

    //console.log("Total Grades:", totalGrades);
    // console.log("Count of Courses with Valid Grades:", countCoursesWithGrades);
    // console.log("Average:", average);

    return average;
  };
  useEffect(() => {
    console.log(
      "courseCodesWithoutPrerequisites:",
      courseCodesWithoutPrerequisites
    );
    console.log(
      "withoutPrerequisiteWithGrades:",
      withoutPrerequisiteWithGrades
    );
  }, [courseCodesWithoutPrerequisites, withoutPrerequisiteWithGrades]);

  function canEditCourse(
    courseItem,
    prerequisiteCoursesWithGrades,
    gradesAndRemarks,
    courseCodesWithoutPrerequisites,
    withoutPrerequisiteWithGrades
  ) {
    const { pre_requisite, course_code } = courseItem;

    console.log("Course Code:", course_code);
    console.log("Pre-requisite:", pre_requisite);
    console.log(
      "Prerequisite Courses with Grades:",
      prerequisiteCoursesWithGrades
    );
    console.log("Grades and Remarks:", gradesAndRemarks);
    console.log(
      "Courses Without Prerequisites:",
      courseCodesWithoutPrerequisites
    );
    console.log(
      "Courses without prerequisite that have grades:",
      withoutPrerequisiteWithGrades
    );

    // Handle the case where the prerequisite is "Fourth Year Standing"
    if (pre_requisite && pre_requisite.includes("Fourth Year Standing")) {
      // Check if all courses without prerequisites have grades
      const allCoursesWithoutPrerequisitesHaveGrades =
        courseCodesWithoutPrerequisites.every((courseCode) =>
          withoutPrerequisiteWithGrades.includes(courseCode)
        );

      if (!allCoursesWithoutPrerequisitesHaveGrades) {
        console.log(
          `Not all courses without prerequisites have grades for ${course_code}.`
        );
        return false; // Disable the Edit button
      }
    } else {
      // Check if the course has prerequisites
      if (pre_requisite && pre_requisite.trim() !== "") {
        // Check if all prerequisites have grades
        const prerequisitesHaveGrades = pre_requisite
          .split(",")
          .map((prerequisiteCode) => prerequisiteCode.trim())
          .every((prerequisiteCode) => {
            // Check if the prerequisite has grades
            return prerequisiteCoursesWithGrades.includes(prerequisiteCode);
          });

        // Check if any prerequisite has a grade of 5, -1, or 0
        const hasUndesirablePrerequisiteGrade =
          prerequisitesHaveGrades &&
          pre_requisite
            .split(",")
            .map((prerequisiteCode) => prerequisiteCode.trim())
            .some((prerequisiteCode) => {
              const prerequisiteGrade = gradesAndRemarks.find(
                (item) => item.course_code === prerequisiteCode
              )?.grades;

              return ["5", "-1", "0"].includes(prerequisiteGrade?.toString());
            });

        if (!prerequisitesHaveGrades || hasUndesirablePrerequisiteGrade) {
          console.log(
            `Prerequisites for ${course_code} do not have grades or have undesirable grades.`
          );
          return false; // Disable the Edit button
        }
      }
    }

    // Continue with other conditions or logic as needed

    return true; // Enable the Edit button
  }

  //fetch program
  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        const response = await axios.get(`${endPoint}/programs`);
        const programs = response.data;

        // Assuming programs is an array of objects with properties program_id, program_abbr, program_name
        const selectedProgram = programs.find(
          (programTable) => programTable.program_id === program
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
  }, [program]);
  return (
    <Flex flexDirection="column" w="95wv">
      <Text fontSize="19px" fontWeight="bold">
        {programName}
      </Text>

      <HStack mt="1rem">
        <Text fontSize="17.5px" fontWeight="semibold">
          Student Name:
        </Text>
        <Text
          fontWeight="md"
          fontSize="17.5px"
          fontStyle="Bitter"
          textAlign="center"
        >
          {capitalizeWords(studentData.first_name)}{" "}
          {capitalizeWords(studentData.middle_name)}{" "}
          {capitalizeWords(studentData.last_name)}
        </Text>
      </HStack>
      <Wrap>
        {Object.keys(filteredCourses).map((key) => {
          const filteredCourseItems = filteredCourses[key];
          const [courseYear, courseSemester] = key.split(" ");

          console.log("Course Year", courseYear);

          let originalSchoolYearStart = parseInt(studentNumber.substring(0, 4));
          let schoolYearStart = originalSchoolYearStart;
          let schoolYearEnd;

          if (courseYear === "First") {
            schoolYearEnd = schoolYearStart + 1;
          } else if (courseYear === "Second") {
            schoolYearStart = originalSchoolYearStart + 1;
            schoolYearEnd = schoolYearStart + 1;
          } else if (courseYear === "Third") {
            schoolYearStart = originalSchoolYearStart + 2;
            schoolYearEnd = schoolYearStart + 1;
          } else if (courseYear === "Fourth") {
            schoolYearStart = originalSchoolYearStart + 3;
            schoolYearEnd = schoolYearStart + 1;
          } else {
            schoolYearEnd = schoolYearStart + 5;
          }

          const schoolYear = `${schoolYearStart}-${schoolYearEnd}`;
          //let countCoursesWithGrades = 0;
          let totalLectureHours = 0;
          let totalLabHours = 0;
          let totalCourseCredits = 0;

          const totalGrades = calculateTotalGrades(filteredCourseItems);

          filteredCourseItems.forEach((courseItem) => {
            const gradesAndRemark = gradesAndRemarks.find(
              (item) => item.course_code === courseItem.course_code
            );
            console.log(
              `Grades and Remark for ${courseItem.course_code}:`,
              gradesAndRemark
            );
          });

          const hasCourses = filteredCourseItems.length > 0;

          if (hasCourses) {
            return (
              <Flex w="82vw" overflow="visible" key={key}>
                <VStack w="100%">
                  <VStack
                    mt="2rem"
                    spacing={{ base: 0, md: 4 }}
                    align="flex-start"
                    w="100%"
                    pl="1rem"
                  >
                    <HStack flexWrap="wrap">
                      <Text fontSize="17.5px" fontWeight="semibold">
                        Year Level:
                      </Text>
                      <Text w="10rem" fontWeight="md" fontSize="17.5px">
                        {`${courseYear} Year `}
                      </Text>
                    </HStack>

                    <HStack
                      // spacing={{ base: "0rem", md: "0rem", lg: "15rem" }}
                      flexWrap="wrap"
                      justifyContent={{
                        base: "flex-start",
                        md: "flex-start",
                      }}
                    >
                      <HStack>
                        <Text fontSize="17.5px" fontWeight="semibold">
                          Semester:
                        </Text>
                        <Text w="10rem" fontWeight="md" fontSize="17.5px">
                          {`${capitalizeWords(courseSemester)} Semester `}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="17.5px" fontWeight="semibold">
                          School Year:
                        </Text>
                        <Text>{schoolYear}</Text>
                      </HStack>
                    </HStack>
                  </VStack>

                  <TableContainer overflowX="auto" w="100%" mt="1rem">
                    <Table
                      variant="simple"
                      fontFamily="inter"
                      size="sm"
                      // style={{ minWidth: "800px" }}
                    >
                      <Thead bg="palette.primary" h="5rem">
                        <Tr>
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
                          <Th
                            style={{ textAlign: "center" }}
                            color="palette.secondary"
                          >
                            Date
                          </Th>
                          <Th
                            style={{ textAlign: "center" }}
                            color="palette.secondary"
                          >
                            Action
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredCourseItems.map((courseItem) => {
                          const gradesAndRemark = gradesAndRemarks.find(
                            (item) =>
                              item.course_code === courseItem.course_code
                          );

                          const validationEntry = validationData.find(
                            (entry) => entry.course_id === courseItem.course_id
                          );

                          const isCourseValidated =
                            validationEntry && validationEntry.date_validated;

                          const formattedDate = isCourseValidated
                            ? formatValidatedDate(
                                validationEntry.date_validated
                              )
                            : "";

                          const hasDate =
                            validationEntry && validationEntry.date_validated;

                          totalLectureHours += courseItem.num_lecture;
                          totalLabHours += courseItem.num_lab;
                          totalCourseCredits += courseItem.credit_unit;

                          return (
                            <Tr key={courseItem.course_code}>
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
                                {renderPrerequisites(courseItem.pre_requisite)}
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
                                {gradesAndRemark
                                  ? gradesAndRemark.grades === 0
                                    ? "Withdraw"
                                    : gradesAndRemark.grades === -1
                                    ? "Incomplete"
                                    : typeof gradesAndRemark.grades === "number"
                                    ? gradesAndRemark.grades.toFixed(2)
                                    : ""
                                  : ""}
                              </Td>
                              <Td
                                fontSize="14px"
                                fontStyle="bitter"
                                style={{ textAlign: "center" }}
                              >
                                {gradesAndRemark
                                  ? gradesAndRemark.grades === 0
                                    ? "Withdraw"
                                    : gradesAndRemark.grades === -1
                                    ? "Incomplete"
                                    : gradesAndRemark.remarks
                                  : ""}
                              </Td>

                              <Td>
                                {console.log(
                                  "Course Code:",
                                  courseItem.course_code
                                )}
                                {console.log("Formatted Date:", formattedDate)}
                                {hasDate ? formattedDate : ""}
                              </Td>

                              <Td>
                                {/* {console.log("hasDate:", hasDate)} */}
                                {hasDate ? (
                                  <Button disabled>Edit</Button>
                                ) : (
                                  <>
                                    <Button
                                      onClick={() => {
                                        if (
                                          canEditCourse(
                                            courseItem,
                                            prerequisiteCoursesWithGrades,
                                            gradesAndRemarks,
                                            courseCodesWithoutPrerequisites,
                                            withoutPrerequisiteWithGrades
                                          )
                                        ) {
                                          handleEditCourse(courseItem);
                                        }
                                      }}
                                      disabled={
                                        !canEditCourse(
                                          courseItem,
                                          prerequisiteCoursesWithGrades,
                                          gradesAndRemarks,
                                          courseCodesWithoutPrerequisites,
                                          withoutPrerequisiteWithGrades
                                        )
                                      }
                                    >
                                      Edit
                                    </Button>

                                    <Button
                                      ml={3}
                                      onClick={() =>
                                        deleteGradesForCourse(
                                          courseItem.course_code
                                        )
                                      }
                                      style={{
                                        backgroundColor: "maroon",
                                        color: "white",
                                      }}
                                    >
                                      {" "}
                                      Clear
                                    </Button>
                                  </>
                                )}
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
                          <Th
                            fontSize="13px"
                            fontStyle="bitter"
                            style={{ textAlign: "center" }}
                          >
                            {totalGrades !== undefined && !isNaN(totalGrades)
                              ? totalGrades.toFixed(2)
                              : " "}
                          </Th>
                          <Th
                            fontSize="13px"
                            fontStyle="bitter"
                            style={{ textAlign: "center" }}
                          >
                            {(() => {
                              if (
                                totalGrades !== undefined &&
                                !isNaN(totalGrades)
                              ) {
                                if (totalGrades >= 1.0 && totalGrades <= 3.0) {
                                  return "P";
                                } else if (totalGrades === 5.0) {
                                  return "F";
                                } else {
                                  return "";
                                }
                              }
                              return " ";
                            })()}
                          </Th>
                          <Th></Th>
                          <Th></Th>
                        </Tr>
                      </Tfoot>
                    </Table>
                  </TableContainer>
                  <Button
                    mt="1rem"
                    color="white"
                    bg="palette.primary"
                    w="5rem"
                    ml={{ base: "0", md: "auto" }}
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
                    onClick={() => handleValidateCourse(filteredCourseItems)}
                  >
                    Validate
                  </Button>
                </VStack>
              </Flex>
            );
          }

          return null;
          //here
        })}
      </Wrap>
      <GradesModal
        isOpen={isGradesModalOpen}
        onClose={handleGradesModalClose}
        selectedCourseCode={editedCourse ? editedCourse.course_code : ""}
        currentGrades={editedCourse ? editedCourse.grades : ""}
        studentNumber={studentNumber}
        program={program}
        strand={strand}
        onSaveSuccess={handleGradesSaved}
      />
      {/* {console.log(
        "Component re-rendered with updated state:",
        gradesAndRemarks
      )} */}
    </Flex>
  );
}

UsersData.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  facultyId: PropTypes.string.isRequired,
  program: PropTypes.number.isRequired,

  strand: PropTypes.string,
};

export default UsersData;
