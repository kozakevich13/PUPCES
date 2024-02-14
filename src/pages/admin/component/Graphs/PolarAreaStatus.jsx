import axios from "axios";
import Chart from "chart.js/auto";
import { useEffect, useState } from "react";
import { endPoint } from "../../../config";

const PolarAreaChart = () => {
  const [regular, setRegular] = useState(0);
  const [backSubject, setBackSubject] = useState(0);
  const [transferee, setTransferee] = useState(0);
  const [shiftee, setShiftee] = useState(0);
  const [returnee, setReturnee] = useState(0);

  useEffect(() => {
    // Fetch and count all students with different statuses
    axios
      .get(`${endPoint}/students/all`)
      .then((response) => {
        const students = response.data;

        const regularCount = students.filter(
          (student) => student.status === "Regular"
        ).length;
        const backSubjectCount = students.filter(
          (student) => student.status === "Back Subject"
        ).length;
        const transfereeCount = students.filter(
          (student) => student.status === "Transferee"
        ).length;
        const shifteeCount = students.filter(
          (student) => student.status === "Shiftee"
        ).length;
        const returneeCount = students.filter(
          (student) => student.status === "Returnee"
        ).length;

        setRegular(regularCount);
        setBackSubject(backSubjectCount);
        setTransferee(transfereeCount);
        setShiftee(shifteeCount);
        setReturnee(returneeCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("myPolarAreaChart");
    const ctx = canvas.getContext("2d");

    const maxDataValue = Math.max(
      regular,
      backSubject,
      transferee,
      shiftee,
      returnee
    );

    const data = {
      labels: ["Regular", "Back Subject", "Transferee", "Shiftee", "Returnee"],
      datasets: [
        {
          data: [regular, backSubject, transferee, shiftee, returnee],
          backgroundColor: [
            "rgba(255, 87, 51, 0.7)", // Transparent red
            "rgba(255, 176, 0, 0.7)", // Transparent orange
            "rgba(255, 215, 0, 0.7)", // Transparent gold
            "rgba(100, 149, 237, 0.7)", // Transparent cornflower blue
            "rgba(180, 149, 237, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const stepSize = 1;
    const config = {
      type: "polarArea",
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: false,
            text: "Chart.js Polar Area Chart",
          },
        },
        scale: {
          ticks: {
            beginAtZero: true,
            stepSize: stepSize,
            max: Math.ceil((maxDataValue + 5) / stepSize) * stepSize, // Add some padding to the max value for better visualization
          },
        },
      },
    };

    const myPolarAreaChart = new Chart(ctx, config);

    // Update the chart data when the state variables change
    myPolarAreaChart.data.datasets[0].data = [
      regular,
      backSubject,
      transferee,
      shiftee,
      returnee,
    ];
    myPolarAreaChart.update();

    return () => {
      myPolarAreaChart.destroy();
    };
  }, [regular, backSubject, transferee, shiftee, returnee]);

  return (
    <canvas
      id="myPolarAreaChart"
      width={600} // Set the desired width
      height={150} // Set the desired height
      style={{ width: "100%", maxWidth: "300px" }}
    ></canvas>
  );
};

export default PolarAreaChart;
