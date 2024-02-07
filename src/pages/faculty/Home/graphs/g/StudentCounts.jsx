import Chart from "chart.js/auto";
import PropTypes from "prop-types";
import { useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";

export default function StudentCounts({ data }) {
  const yearLabels = ["1st year", "2nd year", "3rd year", "4th year"];

  useEffect(() => {
    const canvas = document.getElementById("myBarChart");
    const ctx = canvas.getContext("2d");

    const myBarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: yearLabels,
        datasets: [
          {
            label: "Total Students",
            data: data,
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
            display: true,
            position: "top",
          },
        },
      },
    });

    return () => {
      myBarChart.destroy();
    };
  }, [data]);

  return (
    <Box textAlign="center" p="4">
      <Heading mb="6" fontSize="xl" fontWeight="bold">
        Students Composition By Year
      </Heading>
      <Box maxWidth="500px" mx="auto">
        <canvas id="myBarChart" style={{ width: "100%", height: "auto" }}></canvas>
      </Box>
      <Box mt="6">
        <Text fontSize="md">
          The bar chart visually represents the distribution of students across different college years.
        </Text>
        {data && data.length === yearLabels.length && (
          <Box mt="4">
            {data.map((count, index) => (
              <Text key={index}>{`In ${yearLabels[index]}, there are ${count} students.`}</Text>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}

StudentCounts.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
};
