import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import ApexCharts from "apexcharts";
import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

function GradesAverageLine({ studentNumber }) {
  const [programId, setProgramId] = useState();
  const [strand, setStrand] = useState();
  const [mappedGradesData, setMappedGradesData] = useState([]);

  const [averageGradesYear1, setAverageGradesYear1] = useState(0);
  const [averageGradesYear2, setAverageGradesYear2] = useState(0);
  const [averageGradesYear3, setAverageGradesYear3] = useState(0);
  const [averageGradesYear4, setAverageGradesYear4] = useState(0);

  // Initialize state variables for Summer Semester
  const [averageGradesForSummerSemester, setAverageGradesForSummerSemester] =
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
        setStrand(studentData.strand);
        console.log("Student data fetched:", studentData);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    }

    fetchStudentData();
    console.log("Fetching student data complete.");
  }, [studentNumber]);

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

        // Map grades data to include relevant curriculum information
        const mappedGradesData = gradesData
          .map((grade) => {
            const correspondingCourse = curriculumData.find(
              (course) => course.course_id === grade.course_id
            );

            if (correspondingCourse && grade.grades !== -1) {
              return {
                course_code: correspondingCourse.course_code,
                grades: grade.grades,
                course_year: correspondingCourse.course_year,
                course_sem: correspondingCourse.course_sem,
              };
            }

            return null;
          })
          .filter(Boolean);

        // Set the mapped grades data in local state
        setMappedGradesData(mappedGradesData);
        console.log("MappedGradesData:", mappedGradesData);

        //First Year
        const filteredYear1Grades = mappedGradesData.filter(
          (entry) =>
            entry.course_year === 1 && entry.course_sem !== "Summer Semester"
        );

        const sumGradesYear1 = filteredYear1Grades.reduce(
          (sum, entry) => sum + entry.grades,
          0
        );

        const countYear1Grades = filteredYear1Grades.length;

        const averageGradesYear1 =
          countYear1Grades > 0
            ? (sumGradesYear1 / countYear1Grades).toFixed(2)
            : 0;

        // Set the result in local state
        setAverageGradesYear1(averageGradesYear1);
        console.log("Average Grades Year 1:", averageGradesYear1);

        //Second Year
        const filteredYear2Grades = mappedGradesData.filter(
          (entry) =>
            entry.course_year === 2 && entry.course_sem !== "Summer Semester"
        );

        const sumGradesYear2 = filteredYear2Grades.reduce(
          (sum, entry) => sum + entry.grades,
          0
        );

        const countYear2Grades = filteredYear2Grades.length;

        const averageGradesYear2 =
          countYear2Grades > 0
            ? (sumGradesYear2 / countYear2Grades).toFixed(2)
            : 0;

        // Set the result in local state
        setAverageGradesYear2(averageGradesYear2);
        console.log("Average Grades Year 2:", averageGradesYear2);

        //summer semester
        const summerSemesterGrades = mappedGradesData
          .filter((entry) => entry.course_sem === "Summer Semester")
          .reduce((sum, entry) => sum + entry.grades, 0);

        // Calculate average for course_sem = "Summer Semester"
        const summerSemesterCount = mappedGradesData.filter(
          (entry) => entry.course_sem === "Summer Semester"
        ).length;

        const averageGradesForSummerSemester =
          summerSemesterCount > 0
            ? (summerSemesterGrades / summerSemesterCount).toFixed(2)
            : 0;

        // Set the result in local state
        setAverageGradesForSummerSemester(averageGradesForSummerSemester);
        console.log(
          "Average Grades for Summer Semester:",
          averageGradesForSummerSemester
        );

        //Third Year
        const filteredYear3Grades = mappedGradesData.filter(
          (entry) =>
            entry.course_year === 3 && entry.course_sem !== "Summer Semester"
        );

        const sumGradesYear3 = filteredYear3Grades.reduce(
          (sum, entry) => sum + entry.grades,
          0
        );

        const countYear3Grades = filteredYear3Grades.length;

        const averageGradesYear3 =
          countYear3Grades > 0
            ? (sumGradesYear3 / countYear3Grades).toFixed(2)
            : 0;

        // Set the result in local state
        setAverageGradesYear3(averageGradesYear3);
        console.log("Average Grades Year 3:", averageGradesYear3);

        //Fourth Year
        const filteredYear4Grades = mappedGradesData.filter(
          (entry) =>
            entry.course_year === 4 && entry.course_sem !== "Summer Semester"
        );

        const sumGradesYear4 = filteredYear4Grades.reduce(
          (sum, entry) => sum + entry.grades,
          0
        );

        const countYear4Grades = filteredYear4Grades.length;

        const averageGradesYear4 =
          countYear4Grades > 0
            ? (sumGradesYear4 / countYear4Grades).toFixed(2)
            : 0;

        // Set the result in local state
        setAverageGradesYear4(averageGradesYear4);
        console.log("Average Grades Year 2:", averageGradesYear4);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle errors here, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [studentNumber, programId]);

  //chart
  useEffect(() => {
    console.log("GradesAverageLine useEffect");

    const options = {
      series: [
        {
          data: [
            averageGradesYear1,
            averageGradesYear2,
            averageGradesYear3,
            averageGradesForSummerSemester,
            averageGradesYear4,
          ],
        },
      ],
      chart: {
        height: 400, // Set the desired height
        width: 1000,
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
        categories: ["First", "Second", "Third", "Summer", "Fourth"],
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
            return val.toFixed(2); // Display two decimal places
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

    const chartElement = document.querySelector("#chart");

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
    averageGradesForSummerSemester,
    averageGradesYear1,
    averageGradesYear2,
    averageGradesYear3,
    averageGradesYear4,
  ]);

  return (
    <VStack>
      <div id="chart"></div>
      <Box padding="2rem">
        {averageGradesYear1 !== undefined && averageGradesYear1 !== 0 && (
          <HStack>
            <Text>You have a General Weighted Average of </Text>
            <Text fontWeight="semibold"> {averageGradesYear1} </Text>
            <Text>for First Year.</Text>
          </HStack>
        )}
        {averageGradesYear2 !== undefined && averageGradesYear2 !== 0 && (
          <HStack>
            <Text>You have a General Weighted Average of </Text>
            <Text fontWeight="semibold">{averageGradesYear2} </Text>
            <Text> for Second Year.</Text>
          </HStack>
        )}
        {averageGradesYear3 !== undefined && averageGradesYear3 !== 0 && (
          <HStack>
            <Text>You have a General Weighted Average of </Text>
            <Text fontWeight="semibold">{averageGradesYear3} </Text>
            <Text> for Third Year.</Text>
          </HStack>
        )}
        {averageGradesForSummerSemester !== undefined &&
          averageGradesForSummerSemester !== 0 && (
            <HStack>
              <Text>You have a General Weighted Average of </Text>
              <Text fontWeight="semibold">
                {" "}
                {averageGradesForSummerSemester}{" "}
              </Text>
              <Text>for Summer.</Text>
            </HStack>
          )}
        {averageGradesYear4 !== undefined && averageGradesYear4 !== 0 && (
          <HStack>
            <Text>You have a General Weighted Average of{" "} </Text>
            <Text fontWeight="semibold">{averageGradesYear4}{" "}</Text>
            <Text> for Fourth Year.</Text>
          </HStack>
        )}
      </Box>
    </VStack>
  );
}

GradesAverageLine.propTypes = {
  studentNumber: PropTypes.string.isRequired,
};

export default GradesAverageLine;
