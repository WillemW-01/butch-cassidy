import React, { useState, useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function GraphSales(props) {
  const [date1, setDate1] = React.useState([]);
  const [sales, setSales] = React.useState([]);

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/calculate_sales").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setDate1(data.month);
        setSales(data.sales);
      }
    );
  };

  useEffect(() => {
    // getData();
  }, []);

  var options = {
    series: [
      {
        name: "Sales",
        type: "column",
        data: sales,
      },
      // {
      //   name: "Revenue",
      //   type: "line",
      //   data: [20, 29, 37, 36, 44, 45, 50, 58],
      // },
    ],
    chart: {
      height: 350,
      type: "line",
      stacked: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [1, 1, 4],
    },
    title: {
      text: "",
      align: "left",
      offsetX: 110,
    },
    xaxis: {
      categories: date1,
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#008FFB",
        },
        labels: {
          style: {
            colors: "#008FFB",
          },
        },
        title: {
          text: "x 1",
          style: {
            color: "#008FFB",
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: "Income",
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: "#00E396",
        },
        labels: {
          style: {
            colors: "#00E396",
          },
        },
        title: {
          text: "Average Revenue",
          style: {
            color: "#00E396",
          },
        },
      },
    ],
    tooltip: {
      fixed: {
        enabled: true,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
    },
    legend: {
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>
      <ReactApexChart
        className="apex graph"
        options={options}
        series={options.series}
      />
    </div>
  );
}

export default GraphSales;
