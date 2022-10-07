import React from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function Graph() {
  const series = [
    {
      name: "Orders",
      data: [60, 43, 24, 65, 123, 34, 87, 35, 76, 82, 12, 97],
    },
    {
      name: "Items",
      data: [10, 23, 24, 75, 23, 34, 34, 35, 6, 65, 12, 45],
    },
  ];
  const options = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "1/01/2018",
        "2/01/2018",
        "3/01/2018",
        "4/01/2018",
        "5/01/2018",
        "6/01/2018",
        "7/01/2018",
        "8/01/2018",
        "9/01/2018",
        "10/01/2018",
        "11/01/2018",
        "12/01/2018",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy",
      },
    },
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        textAlign: "center",
        // padding: "5px",
        // borderRadius: "5px",
      }}
    >
      <br />
      <h2>Restaurant Data</h2>
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={500}
        width={1000}
      />
      <br />
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={500}
      />
    </div>
  );
}

export default Graph;
