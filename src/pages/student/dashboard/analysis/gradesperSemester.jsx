import ApexCharts from "apexcharts";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

import { VStack, Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

export default function GradesperSemester({
  studentNumber,
  onGradesDataChange,
}) {
  const strand = Cookies.get("strand");
  const [programId, setProgramId] = useState();
  const [courseType, setCourseType] = useState("");
  const [firstYearFirstSem, setFirstYearFirstSem] = useState([]);
  const [firstYearSecondSem, setFirstYearSecondSem] = useState([]);
  const [secondYearFirstSem, setSecondYearFirstSem] = useState([]);
  const [secondYearSecondSem, setSecondYearSecondSem] = useState([]);
  const [thirdYearFirstSem, setThirdYearFirstSem] = useState([]);
  const [thirdYearSecondSem, setThirdYearSecondSem] = useState([]);
  const [fourthYearFirstSem, setFourthYearFirstSem] = useState([]);
  const [fourthYearSecondSem, setFourthYearSecondSem] = useState([]);
  const [summerSem, setSummerSem] = useState([]);
  const [firstYearFirstSemAverage, setFirstYearFirstSemAverage] = useState(0);
  const [firstYearSecondSemAverage, setFirstYearSecondSemAverage] = useState(0);
  const [SecondYearFirstSemAverage, setSecondYearFirstSemAverage] = useState(0);
  const [SecondYearSecondSemAverage, setSecondYearSecondSemAverage] =
    useState(0);
  const [ThirdYearFirstSemAverage, setThirdYearFirstSemAverage] = useState(0);
  const [ThirdYearSecondSemAverage, setThirdYearSecondSemAverage] = useState(0);
  const [FourthYearFirstSemAverage, setFourthYearFirstSemAverage] = useState(0);
  const [FourthYearSecondSemAverage, setFourthYearSecondSemAverage] =
    useState(0);

  //fetch student
  useEffect(() => {
    console.log("Fetching student data...");

    async function fetchStudentData() {
      try {
        const response = await axios.get(
          `${endPoint}/students?studentNumber=${studentNumber}`
        );
        const studentData = response.data;

        setProgramId(studentData.program_id);
        console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();
    console.log("Fetching student data complete.");
  }, [studentNumber]);

  // fetch curriculum
  useEffect(() => {
    const fetchData = async () => {
      try {
        let courseType = "";
        if (
          studentNumber.startsWith("2020") ||
          studentNumber.startsWith("2021")
        ) {
          courseType = 2019;
        } else {
          courseType = 2022;
        }

        setCourseType(courseType);
        // Fetch curriculum data to get course_year and course_sem information
        const curriculumResponse = await axios.get(
          `${endPoint}/curriculum?program_id=${programId}&year_started=${courseType}`
        );

        const curriculumData = curriculumResponse.data;
        console.log("Curriculum Data:", curriculumData);

        // Fetch grades data
        const gradesResponse = await axios.get(
          `${endPoint}/grades?studentNumber=${studentNumber}`
        );

        const gradesData = gradesResponse.data;
        console.log("Grades Data:", gradesData);

        // Group data by course_id, course_year, and course_sem
        const groupedData = gradesData.reduce((result, item) => {
          // Find the corresponding curriculum item
          const curriculumItem = curriculumData.find(
            (curriculum) => curriculum.course_id === item.course_id
          );

          if (
            curriculumItem &&
            !(
              programId === 1 &&
              (strand === "STEM" || strand === "ICT") &&
              curriculumItem.course_sem === "Bridging"
            )
          ) {
            const key = `${curriculumItem.course_sem}_${
              curriculumItem.course_year || "undefined"
            }`;

            if (!result[key]) {
              result[key] = {
                course_year: curriculumItem.course_year,
                course_sem: curriculumItem.course_sem,
                data: [],
              };
            }
            result[key].data.push(item);
          }

          return result;
        }, {});

        console.log("Grouped Data:", groupedData);

        // first year first sem
        const firstYearFirstSemData =
          groupedData["First Semester_1"]?.data || [];

        const filteredFirstYearFirstSemData = firstYearFirstSemData.filter(
          (grade) => grade.grades > 0
        );
        setFirstYearFirstSem(filteredFirstYearFirstSemData);

        //compute
        const sumGrades = filteredFirstYearFirstSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGrade =
          filteredFirstYearFirstSemData.length > 0
            ? sumGrades / filteredFirstYearFirstSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGrade)) {
          const roundedAverage = parseFloat(averageGrade.toFixed(2));
          setFirstYearFirstSemAverage(roundedAverage);
        }
        console.log("firstYearFirstSemData", firstYearFirstSemData);

        //First Year Second Sem
        const firstYearSecondSemData =
          groupedData["Second Semester_1"]?.data || [];

        const filteredFirstYearSecondSemData = firstYearSecondSemData.filter(
          (grade) => grade.grades > 0
        );

        setFirstYearSecondSem(filteredFirstYearSecondSemData);
        //compute
        const sumGradesSecondSem = filteredFirstYearSecondSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeSecondSem =
          filteredFirstYearSecondSemData.length > 0
            ? sumGradesSecondSem / filteredFirstYearSecondSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeSecondSem)) {
          const roundedAverage = parseFloat(averageGradeSecondSem.toFixed(2));
          setFirstYearSecondSemAverage(roundedAverage);
        }

        //Second Year First Sem
        const secondYearFirstSemData =
          groupedData["First Semester_2"]?.data || [];

        const filteredSecondYearFirstSemData = secondYearFirstSemData.filter(
          (grade) => grade.grades > 0
        );
        setSecondYearFirstSem(filteredSecondYearFirstSemData);

        //compute
        const sumGradesSecondFirstSem = filteredSecondYearFirstSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeSecondFirstSem =
          filteredSecondYearFirstSemData.length > 0
            ? sumGradesSecondFirstSem / filteredSecondYearFirstSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeSecondFirstSem)) {
          const roundedAverage = parseFloat(
            averageGradeSecondFirstSem.toFixed(2)
          );
          setSecondYearFirstSemAverage(roundedAverage);
        }

        //Second Year Second Sem
        const secondYearSecondSemData =
          groupedData["Second Semester_2"]?.data || [];

        // Filter out grades of -1 and 0
        const filteredSecondYearSecondSemData = secondYearSecondSemData.filter(
          (grade) => grade.grades > 0
        );
        setSecondYearSecondSem(filteredSecondYearSecondSemData);

        //compute
        const sumGradesSecondSecondSem = filteredSecondYearSecondSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeSecondSecondSem =
          filteredSecondYearSecondSemData.length > 0
            ? sumGradesSecondSecondSem / filteredSecondYearSecondSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeSecondSecondSem)) {
          const roundedAverage = parseFloat(
            averageGradeSecondSecondSem.toFixed(2)
          );
          setSecondYearSecondSemAverage(roundedAverage);
        }

        //Third Year First Sem
        const thirdYearFirstSemData =
          groupedData["First Semester_3"]?.data || [];

        // Filter out grades of -1 and 0
        const filteredThirdYearFirstSemData = thirdYearFirstSemData.filter(
          (grade) => grade.grades > 0
        );
        setThirdYearFirstSem(filteredThirdYearFirstSemData);

        //compute
        const sumGradesThirdFirstSem = filteredThirdYearFirstSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeThirdFirstSem =
          filteredThirdYearFirstSemData.length > 0
            ? sumGradesThirdFirstSem / filteredThirdYearFirstSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeThirdFirstSem)) {
          const roundedAverage = parseFloat(
            averageGradeThirdFirstSem.toFixed(2)
          );
          setThirdYearFirstSemAverage(roundedAverage);
        }

        //Third Year Second Sem
        const thirdYearSecondSemData =
          groupedData["Second Semester_3"]?.data || [];

        // Filter out grades of -1 and 0
        const filteredThirdYearSecondSemData = thirdYearSecondSemData.filter(
          (grade) => grade.grades > 0
        );

        setThirdYearSecondSem(filteredThirdYearSecondSemData);
        //compute
        const sumGradesThirdSecondSem = filteredThirdYearSecondSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeThirdSecondSem =
          filteredThirdYearSecondSemData.length > 0
            ? sumGradesThirdSecondSem / filteredThirdYearSecondSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeThirdSecondSem)) {
          const roundedAverage = parseFloat(
            averageGradeThirdSecondSem.toFixed(2)
          );
          setThirdYearSecondSemAverage(roundedAverage);
        }

        //Fourth Year First Sem
        const fourthYearFirstSemData =
          groupedData["First Semester_4"]?.data || [];

        // Filter out grades of -1 and 0
        const filteredFourthYearFirstSemData = fourthYearFirstSemData.filter(
          (grade) => grade.grades > 0
        );
        setFourthYearFirstSem(filteredFourthYearFirstSemData);

        //compute
        const sumGradesFourthFirstSem = fourthYearFirstSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeFourthFirstSem =
          filteredFourthYearFirstSemData.length > 0
            ? sumGradesFourthFirstSem / filteredFourthYearFirstSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeFourthFirstSem)) {
          const roundedAverage = parseFloat(
            averageGradeFourthFirstSem.toFixed(2)
          );
          setFourthYearFirstSemAverage(roundedAverage);
        }

        // fourthyear second sem
        const fourthYearSecondSemData =
          groupedData["Second Semester_4"]?.data || [];

        const filteredFourthYearSecondSemData = fourthYearSecondSemData.filter(
          (grade) => grade.grades > 0
        );
        setFourthYearSecondSem(filteredFourthYearSecondSemData);

        //compute
        const sumGradesFourthSecondSem = filteredFourthYearSecondSemData.reduce(
          (sum, grade) => sum + grade.grades,
          0
        );

        const averageGradeFourthSecondSem =
          filteredFourthYearSecondSemData.length > 0
            ? sumGradesFourthSecondSem / filteredFourthYearSecondSemData.length
            : 0;

        // Check if average is NaN (optional)
        if (!isNaN(averageGradeFourthSecondSem)) {
          const roundedAverage = parseFloat(
            averageGradeFourthSecondSem.toFixed(2)
          );
          setFourthYearSecondSemAverage(roundedAverage);
        }

        if (onGradesDataChange) {
          onGradesDataChange({
            firstYearFirstSemAverage,
            firstYearSecondSemAverage,
            SecondYearFirstSemAverage,
            SecondYearSecondSemAverage,
            ThirdYearFirstSemAverage,
            ThirdYearSecondSemAverage,
            FourthYearFirstSemAverage,
            FourthYearSecondSemAverage,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [
    studentNumber,
    programId,
    courseType,
    strand,
    firstYearFirstSemAverage,
    firstYearSecondSemAverage,
    SecondYearFirstSemAverage,
    SecondYearSecondSemAverage,
    ThirdYearFirstSemAverage,
    ThirdYearSecondSemAverage,
    FourthYearFirstSemAverage,
    FourthYearSecondSemAverage,
  ]);

  useEffect(() => {
    console.log("GradesAverageLine useEffect");

    const options = {
      series: [
        {
          data: [
            firstYearFirstSemAverage,
            firstYearSecondSemAverage,
            SecondYearFirstSemAverage,
            SecondYearSecondSemAverage,
            ThirdYearFirstSemAverage,
            ThirdYearSecondSemAverage,
            FourthYearFirstSemAverage,
            FourthYearFirstSemAverage,
          ],
        },
      ],
      chart: {
        // height: 400, // Set the desired height
        // width: 1000,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["#77B6EA"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: [
          "Year 1 First ",
          "Year 1 Second ",
          "Year 2 First ",
          "Year 2 Second ",
          "Year 3 First ",
          "Year 3 Second ",
          "Year 3 Summer ",
          "Year 4 First ",
          "Year 4 Second ",
        ],
        labels: {
          style: {
            fontSize: "12px",
          },
        },
      },
      yaxis: {
        min: 1,
        max: 5,
        reversed: true,
        tickAmount: 16,
        labels: {
          formatter: function (val) {
            return val.toFixed(2);
          },
        },
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };

    const chartElement = document.querySelector("#chart2");

    if (chartElement) {
      // Check if the chart is already rendered
      if (!chartElement.classList.contains("apexcharts-canvas")) {
        const chart = new ApexCharts(chartElement, options);
        chart.render();

        // Cleanup function to destroy the chart when the component is unmounted
        return () => {
          chart.destroy();
        };
      }
    }
  }, [
    FourthYearFirstSemAverage,
    SecondYearFirstSemAverage,
    SecondYearSecondSemAverage,
    ThirdYearFirstSemAverage,
    ThirdYearSecondSemAverage,
    firstYearFirstSemAverage,
    firstYearSecondSemAverage,
  ]);

  return (
    <VStack>
      <Box w={{ base: "280px", md: "400px", lg: "800px" }} id="chart2"></Box>;
    </VStack>
  );
}

GradesperSemester.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  onGradesDataChange: PropTypes.func.isRequired,
};
