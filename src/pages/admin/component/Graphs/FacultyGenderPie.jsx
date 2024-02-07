import PropTypes from "prop-types";

import Chart from "react-apexcharts";
import {useState, useEffect} from "react";
import axios from "axios";
import { endPoint } from "../../../config";

const PieChart = () => {

    const [femaleFaculty, setFemaleFaculty] = useState(0);
    const [maleFaculty, setMaleFaculty] = useState(0);

    useEffect(() => {
      // Fetch and count all students with the specified gender
      axios
        .get(`${endPoint}/faculty`)
        .then((response) => {
          // Assuming each student object has a "gender" property
          const data = response.data;

          const maleCount = data.filter(
            (faculty) => faculty.gender === "Male"
          ).length;
          const femaleCount = data.filter(
            (faculty) => faculty.gender === "Female"
          ).length;

          setMaleFaculty(maleCount);
          setFemaleFaculty(femaleCount);
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);
  const options = {
    chart: {
      type: "pie",
    },
    labels: [" Male", "Female"],
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

  const series = [maleFaculty, femaleFaculty];

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
