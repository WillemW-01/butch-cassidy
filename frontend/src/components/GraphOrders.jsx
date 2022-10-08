import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import TimeOptions from "./TimeOptions";
import Spinner from "./Spinner";
import "../App.css";

function GraphOrders(props) {
  const [date, setDate] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);

  const submit = (pastValue, futureValue, interval) => {
    setShouldShow(false);
    console.log(
      `Got past: ${pastValue} and future: ${futureValue} and interval: ${interval}`
    );
    const url = `http://127.0.0.1:8000/analytics/get_${interval}_quantities`;
    fetch(url).then(async (response) => {
      const data = await response.json();
      console.log(data);
      setDate(data.time);
      setQuantities(data.quantities);
      setShouldShow(true);
    });
  };

  useEffect(() => {
    submit(0, 0, "weekly");
  }, []);

  const series = [
    {
      name: "Quantity Sold",
      data: quantities,
    },
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
          x: new Date(date[date.length - 13]).getTime(),
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
      width: 0.5,
      dashArray: 0,
    },
    xaxis: {
      type: "datetime",
      categories: date,
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
        gradientToColors: ["#000000", "#231c4b"],
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
      {!shouldShow ? (
        <Spinner type="balls" height={300} />
      ) : (
        <>
          <TimeOptions submit={submit} />
          <ReactApexChart
            className="apex graph"
            options={options}
            series={series}
            type="area"
            width={700}
            height={300}
          />
        </>
      )}
    </div>
  );
}

export default GraphOrders;
