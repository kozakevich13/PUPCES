import { useEffect } from "react";
import Chart from "chart.js/auto";
import PropTypes from "prop-types";

const Irregular = ({
  regularStudents,
  ladderizedStudents,
  shifteeStudents,
  returneeStudents,
  backSubjectStudents,
  transfereeStudents,
}) => {
  useEffect(() => {
    const canvas = document.getElementById("myLineGraph");

    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");

    const data = {
      labels: ["Regular", "Shiftie", "Transferee", "Back Subject", "Returnee", "Ladderized"],
      datasets: [
        {
          label: "Total number of Students based on their status",
          data: [
            5, 10, 15, 20, 25, 10
          ],
          borderColor: "cyan",
          pointBackgroundColor: ["yellow", "violet", "orange", "green", "red"],
          fill: true,
          backgroundColor: "rgba(255, 165, 0, 0.3)",
        },
      ],
    };

    const options = {
      maintainAspectRatio: false,
      plugins: {
        title: {
          text: "Lists of Irregular Students",
          display: true,
        },
      },
      aspectRatio: 3,
      scales: {
        x: {
          title: {
            display: true,
          },
        },
        y: {
          title: {
            display: true,
            text: "No. of Students",
          },
        },
      },
    };

    const myLineGraph = new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });

    return () => {
      myLineGraph.destroy();
    };
  }, [regularStudents, shifteeStudents, transfereeStudents, backSubjectStudents, returneeStudents, ladderizedStudents]);

  return (
    <div style={{ marginTop: "80px" }}>
      <canvas
        id="myLineGraph"
        width="600"
        height="200"
        style={{ marginTop: "20px" }}
      ></canvas>
    </div>
  );
};

Irregular.propTypes = {
  regularStudents: PropTypes.number.isRequired,
  ladderizedStudents: PropTypes.number.isRequired,
  shifteeStudents: PropTypes.number.isRequired,
  returneeStudents: PropTypes.number.isRequired,
  backSubjectStudents: PropTypes.number.isRequired,
  transfereeStudents: PropTypes.number.isRequired,
};

export default Irregular;
