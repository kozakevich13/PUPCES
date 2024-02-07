import ReactApexChart from "react-apexcharts";

const SparklineAreaComponent = () => {
  const options = {
    chart: {
      type: "area",
      height: 100,
      sparkline: {
        enabled: true,
      },
    },
    stroke: {
      curve: "smooth",
    },
    fill: {
      opacity: 0.3,
    },
    xaxis: {
      crosshairs: {
        width: 1,
      },
    },
    yaxis: {
      show: false,
    },
    series: [
      {
        data: [10, 20, 18, 25, 22, 30, 24],
        dataLabels: {
          enabled: false, // Set this to false to hide data labels
        },
      },
    ],
  };

  return (
    <div style={{ height: "160px" }}>
      <ReactApexChart
        options={options}
        
        type="area"
        height={100}
      />
    </div>
  );
};

export default SparklineAreaComponent;
