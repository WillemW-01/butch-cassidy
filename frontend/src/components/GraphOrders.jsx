import React, { useState, useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function GraphOrders(props) {
  const [date1, setDate1] = React.useState([]);
  const [quantities, setQuantities] = React.useState([]);
  const [date2, setDate2] = React.useState("");
  const [orders2, setOrders2] = React.useState([]);

  const getDayData = () => {
    fetch("http://127.0.0.1:8000/analytics/get_daily_quantities").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setDate1(data.day);
        setQuantities(data.quantities);
      }
    );
  };

  const getMonthData = () => {
    fetch("http://127.0.0.1:8000/analytics/get_monthly_quantities").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setDate1(data.month);
        setQuantities(data.quantities);
      }
    );
  };

  const getWeeklyData = () => {
    fetch("http://127.0.0.1:8000/analytics/get_weekly_quantities").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setDate1(data.week);
        setQuantities(data.quantities);
      }
    );
  };

  useEffect(() => {
    // getDayData();
    // getMonthData();
    getWeeklyData();
  }, []);

  const series = [
    {
      name: "Quantity Sold",
      data: quantities,
    },
    // {
    //   name: "Orders",
    //   data: orders2,
    // },
  ];
  const options = {
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
    },

    annotations: {
      xaxis: [
        {
          x: new Date(date1[date1.length - 13]).getTime(),
          borderColor: "#999",
          yAxisIndex: 0,
          label: {
            show: true,
            text: "Forecast Start",
            style: {
              color: "#fff",
              background: "#775DD0",
            },
          },
        },
      ],
    },

    tooltip: {
      x: {
        format: "dd MMM yyyy",
      },
    },

    stroke: {
      show: true,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    xaxis: {
      type: "datetime",
      categories: date1,
    },
    title: {
      text: "",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        gradientToColors: ["#38E54D"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100, 100, 100],
      },
    },
    forecastDataPoints: {
      count: 12,
      fillOpacity: 0.5,
      strokeWidth: undefined,
      dashArray: 6,
    },
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>
      <ReactApexChart
        className="apex graph"
        options={options}
        series={series}
        type="area"
        width={700}
        height={360}
      />
    </div>
  );
}

export default GraphOrders;
