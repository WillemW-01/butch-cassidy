import React, { useState, useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function GraphOrders(props) {
  const [date1, setDate1] = React.useState([]);
  const [orders1, setOrders1] = React.useState([]);
  const [date2, setDate2] = React.useState("");
  const [orders2, setOrders2] = React.useState([]);

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/monthly_orders1").then(
      async (response) => {
        const data = await response.json();
        setDate1(data.month);
        setOrders1(data.orders);
      }
    );

    // fetch("http://127.0.0.1:8000/analytics/monthly_orders2").then(
    //   async (response) => {
    //     const data = await response.json();
    //     console.log(data);
    //     setDate2(data.month);
    //     setOrders2(data.orders);
    //   }
    // );
  };

  useEffect(() => {
    getData();
  }, []);

  const options = {
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
    },

    stroke: {
      curve: "smooth",
      colors: "#00000",
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

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
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
        series={[
          {
            name: "Orders",
            data: orders1,
          },
        ]}
        type="area"
        width={700}
        height={360}
      />
    </div>
  );
}

export default GraphOrders;
