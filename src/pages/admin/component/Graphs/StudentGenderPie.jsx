import PropTypes from "prop-types";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import axios from "axios";
import { endPoint } from "../../../config";

const PieChart = () => {
  const [femaleStudents, setFemaleStudents] = useState(0);
  const [maleStudents, setMaleStudents] = useState(0);

  useEffect(() => {
    // Fetch and count all students with the specified gender
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        // Assuming each student object has a "gender" property
        const students = response.data;

        const maleCount = students.filter(
          (student) => student.gender === "Male"
        ).length;
        const femaleCount = students.filter(
          (student) => student.gender === "Female"
        ).length;

        setMaleStudents(maleCount);
        setFemaleStudents(femaleCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const options = {
    chart: {
      type: "pie",
    },
    labels: ["Male", "Female"],
    legend: {
      position: "top",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  const series = [maleStudents, femaleStudents];

  return (
    <div className="pie-chart-container">
      <Chart options={options} series={series} type="pie" width="500" />
    </div>
  );
};

PieChart.propTypes = {
  onLabelSelect: PropTypes.func,
};

export default PieChart;
