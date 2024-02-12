import axios from "axios";
import Chart from "chart.js/auto";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";
import { Box } from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";

export default function CreditUnits({
  studentNumber,
  onRemainingCreditUnitsChange,
  onValidatedTotalUnitsChange,
  onTotalCreditUnitsChange,
}) {
  const [remainingCreditUnits, setRemainingCreditUnits] = useState(0);
  const [totalCreditUnits, setTotalCreditUnits] = useState(0);
  const [creditUnits, setCreditUnits] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [validatedTotalunits, setValidatedTotalUnits] = useState(0);
  const [validatedCourse, setValidatedCourse] = useState({});
  const [courseType, setCourseType] = useState("");
  const [programId, setProgramId] = useState("");

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

    if (studentNumber) {
      fetchStudentData();
    }
  }, [studentNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!programId || !studentNumber) {
          return;
        }

        console.log("Fetching data for studentNumber:", studentNumber);

        // Fetch data from validateData endpoint
        const validateResponse = await axios.get(
          `${endPoint}/validateData?studentNumber=${studentNumber}`
        );

        console.log("Response data:", validateResponse.data);
        const validateData = validateResponse.data || [];

        setValidatedCourse(validateData);
        console.log("Data fetched successfully");

        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [studentNumber, programId]);

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

        if (combinedData.length > 0 && !("course_id" in combinedData[0])) {
          console.error("Invalid data format. Missing 'course_id' property.");
          return;
        }

        let totalCreditUnits = 0;
        combinedData.forEach((course) => {
          if (
            !(
              programId === 1 &&
              (Cookies.get("strand") === "STEM" ||
                Cookies.get("strand") === "ICT") &&
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

        const courseIds = combinedData.map((course) => course.course_id);

        const matchingCourseIds = validatedCourse.filter((course) =>
          courseIds.includes(course.course_id)
        );

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

        console.log("Credit Units:", creditUnitsMap);
        setCreditUnits(creditUnitsMap);
      })
      .catch((error) => {
        console.error("Error fetching curriculum data:", error.message);
      });
  }, [programId, studentNumber, validatedCourse]);

  useEffect(() => {
    const updateCreditUnitsData = () => {
      const remainingCreditUnits = totalCreditUnits - validatedTotalunits;
      setRemainingCreditUnits(remainingCreditUnits);

      console.log("validated", validatedTotalunits);
      onRemainingCreditUnitsChange(remainingCreditUnits);
      onValidatedTotalUnitsChange(validatedTotalunits);
      onTotalCreditUnitsChange(totalCreditUnits);
    };

    updateCreditUnitsData();
  }, [totalCreditUnits, validatedTotalunits]);

  useEffect(() => {
    if (dataFetched) {
      const canvas = document.getElementById("myPieChart");
      const ctx = canvas.getContext("2d");
      // canvas.width = 400;
      // canvas.height = 400;

      const myPieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Taken Units", "Remaining Units"],
          datasets: [
            {
              data: [validatedTotalunits, remainingCreditUnits],
              backgroundColor: ["#FF5733", "#FFB000"],
            },
          ],
        },
      });

      return () => {
        myPieChart.destroy();
      };
    }
  }, [
    dataFetched,
    validatedTotalunits,
    totalCreditUnits,
    remainingCreditUnits,
  ]);

  return (
    <Box
      position="relative"
      top="0"
      right="0"
      zIndex="0"
      width={{ base: "200px", md: "300px", lg: "400px" }}
      height={{ base: "200px", md: "300px", lg: "400px" }}
    >
      <canvas
        id="myPieChart"
        // height="100%"
      ></canvas>
    </Box>
  );
}

CreditUnits.propTypes = {
  studentNumber: PropTypes.string.isRequired,
  onRemainingCreditUnitsChange: PropTypes.func.isRequired,
  onValidatedTotalUnitsChange: PropTypes.func.isRequired,
  onTotalCreditUnitsChange: PropTypes.func.isRequired,
};
