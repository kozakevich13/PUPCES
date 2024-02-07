import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import PropTypes from "prop-types";

export default function GenderChart({ data }) {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    if (data) {
      const labels = data.map((item) => item.gender);
      const maleValues = data.map((item) => item.male);
      const femaleValues = data.map((item) => item.female);

      const backgroundColors = data.map(() => "transparent");

      const config = {
        type: "line", // Changed to line chart
        data: {
          labels: labels,
          datasets: [
            {
              label: "Male",
              data: maleValues,
              borderColor: "blue",
              backgroundColor: "transparent",
              borderWidth: 1,
              pointBackgroundColor: "blue",
            },
            {
              label: "Female",
              data: femaleValues,
              borderColor: "pink",
              backgroundColor: "transparent",
              borderWidth: 1,
              pointBackgroundColor: "pink",
            },
          ],
        },
        options: {
          maintainAspectRatio: true,
          plugins: {
            title: {
              text: "Gender Distribution by Year",
              display: true,
            },
            legend: {
              display: true, // Show legend
              position: "bottom",
              labels: {
                fontColor: "black", // You can customize the font color
              },
            },
          },
        },
      };

      const ctx = chartRef.current.getContext("2d");
      chartInstance.current = new Chart(ctx, config);
    }
  }, [data]);

  return (
    <div>
      <canvas ref={chartRef} style={{ width: "100%", height: "auto" }} />
      {data && data.length > 0 && (
        <p style={{ textAlign: "center", marginTop: "10px" }}>
          {`In ${
            data.length > 1 ? "each year, " : ""
          }there is a distribution of ${
            data.length > 1 ? "males and females" : "male and female"
          } students.`}
        </p>
      )}
    </div>
  );
}

GenderChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      gender: PropTypes.string.isRequired,
      male: PropTypes.number.isRequired,
      female: PropTypes.number.isRequired,
    })
  ).isRequired,
};
