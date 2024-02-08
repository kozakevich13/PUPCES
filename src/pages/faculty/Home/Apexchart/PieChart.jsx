import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { endPoint } from "../../../config";

const PieChart = ({ onLabelSelect }) => {
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [firstYearCount, setFirstYearCount] = useState(0);
  const [secondYearCount, setSecondYearCount] = useState(0);
  const [thirdYearCount, setThirdYearCount] = useState(0);
  const [fourthYearCount, setFourthYearCount] = useState(0);
  const [facultyprogram, setFacultyProgram] = useState([]);
  const facultyEmail = Cookies.get("facultyEmail");
  console.log("faculty email in cookies:", facultyEmail);

  const handleSelection = (event, chartContext, config) => {
    const selectedSeriesIndex = config.dataPointIndex;
    const selectedLabel = config.w.globals.labels[selectedSeriesIndex];
    setSelectedLabel(selectedLabel);

    // Invoke the callback with the selected label
    if (onLabelSelect) {
      onLabelSelect(selectedLabel);
    }
  };

  console.log("Selected Label in Pie", selectedLabel);
  useEffect(() => {
    if (facultyEmail) {
      axios
        .get(`${endPoint}/faculty/${encodeURIComponent(facultyEmail)}`)
        .then((response) => {
          const facultyData = response.data;

          setFacultyProgram(facultyData.program_id);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [facultyEmail]);

  useEffect(() => {
    axios
      .get(`${endPoint}/students/program/${facultyprogram}`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        let firstYearCount = 0;
        let secondYearCount = 0;
        let thirdYearCount = 0;
        let fourthYearCount = 0;

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = currentMonth >= 10 ? 2024 : 2023;

        console.log("Current Month:", currentMonth);
        console.log("Current Year:", currentYear);

        data.forEach((student) => {
          if (student.student_number) {
            const studentYear = parseInt(
              student.student_number.substring(0, 4),
              10
            );
            const yearIndex = currentYear - studentYear + 1;

            switch (yearIndex) {
              case 1:
                firstYearCount++;
                break;
              case 2:
                secondYearCount++;
                break;
              case 3:
                thirdYearCount++;
                break;
              case 4:
                fourthYearCount++;
                break;
              default:
                console.log("Invalid Year Index:", yearIndex);
                break;
            }
          }
        });
        console.log("First Year Count:", firstYearCount);
        console.log("Second Year Count:", secondYearCount);
        console.log("Third Year Count:", thirdYearCount);
        console.log("Fourth Year Count:", fourthYearCount);

        setFirstYearCount(firstYearCount);
        setSecondYearCount(secondYearCount);
        setThirdYearCount(thirdYearCount);
        setFourthYearCount(fourthYearCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [facultyprogram]);

  const options = {
    chart: {
      type: "pie",
      events: {
        dataPointSelection: handleSelection,
      },
    },
    labels: ["First Year", "Second Year", "Third Year", "Fourth Year"],
    legend: {
      position: "top",
      fontSize: "18px",
      markers: {
        size: 50, // Adjust the size of the legend color indicators
      },
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            width: "800",
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          chart: {
            width: "500",
          },
        },
      },
      {
        breakpoint: 580,
        options: {
          chart: {
            width: "400",
          },
        },
      },
      {
        breakpoint: 380,
        options: {
          chart: {
            width: "300",
          },
        },
      },
    ],
  };

  const series = [
    firstYearCount,
    secondYearCount,
    thirdYearCount,
    fourthYearCount,
  ];

  return (
    <div className="pie-chart-container">
      <Chart options={options} series={series} type="pie" width="800" />
    </div>
  );
};

PieChart.propTypes = {
  onLabelSelect: PropTypes.func,
};

export default PieChart;
