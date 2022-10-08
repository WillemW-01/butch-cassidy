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
    getData();
  }, []);

  var series = [
    {
      name: "Sales",
      data: sales,
    },
  ];

  var options = {
    chart: {
      type: "bar",
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "datetime",
      categories: date1,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return "£" + value;
        },
      },
    },
    stroke: {
      width: 4,
      curve: "straight",
    },
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>
      <ReactApexChart
        className="sales graph"
        options={options}
        series={series}
        width={500}
      />
    </div>
  );
}

export default GraphSales;
