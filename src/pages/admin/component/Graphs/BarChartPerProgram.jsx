import axios from "axios";
import Chart from "chart.js/auto";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";
export default function BarChartPerProgram({ onBarClick }) {
  const [programData, setProgramData] = useState([]);
  const [programCounts, setProgramCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch program data from your API endpoint
    axios
      .get(`${endPoint}/programs`)
      .then((response) => {
        const programs = response.data;

        // Extract program names and program IDs
        const programNames = programs.map((program) => program.program_abbr);
        const programIDs = programs.map((program) => program.program_id);

        // Set state with program names and IDs
        setProgramData({ names: programNames, ids: programIDs });
        console.log(programNames, programIDs);
      })
      .catch((error) => {
        console.error("Error fetching program data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // This useEffect runs once to fetch program data

  useEffect(() => {
    // Fetch student data to count the number of students in each program
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        const students = response.data;

        // Count the number of students in each program
        const count = {};
        students.forEach((student) => {
          const programID = student.program_id;
          count[programID] = (count[programID] || 0) + 1;
        });

        // Set state with program counts
        setProgramCounts(count);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, []); // This useEffect runs once to fetch student data

  useEffect(() => {
    if (!loading && programData.names.length > 0) {
      // Create the chart after fetching data
      const canvas = document.getElementById("myBarChart");
      const ctx = canvas.getContext("2d");

      const myBarChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: programData.names,
          datasets: [
            {
              label: "Programs",
              data: programData.ids.map((id) => programCounts[id] || 0),
              backgroundColor: ["#FF5733", "#FFB000", "#FFD700", "#6495ED"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: {
              grid: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 5,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
          onClick: (event, elements) => {
            // Check if any bars were clicked
            if (elements.length > 0) {
              const clickedIndex = elements[0].index;
              const clickedLabel = programData.names[clickedIndex];
              const clickedProgramId = programData.ids[clickedIndex];
              console.log("Clicked bar label:", clickedLabel);
              console.log("Corresponding program_id:", clickedProgramId);

              onBarClick(clickedProgramId);
            }
          },
        },
      });

      // Cleanup chart on component unmount
      return () => {
        myBarChart.destroy();
      };
    }
  }, [loading, programData, programCounts, onBarClick]); // This useEffect runs whenever programData or programCounts changes

  return (
    <canvas
      id="myBarChart"
      width={300}
      height={200}
      style={{ width: "100%", maxWidth: "600px" }}
    ></canvas>
  );
}
BarChartPerProgram.propTypes = {
  onBarClick: PropTypes.func.isRequired,
};
