import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

function WeekdayGraph(props) {
  const [quantities, setQuantities] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);

  const getData = (props) => {
    setShouldShow(false);
    fetch("http://127.0.0.1:8000/analytics/weekday_popularity").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setQuantities(data.quantity);
        setShouldShow(true);
      }
    );
  };

  useEffect(() => {
    if (props.hasUploaded) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  const series = [
    {
      data: quantities,
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: "100%",
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: "bottom",
        },
      },
    },

    colors: [
      "#231c4b",
      "#3b3b98",
      "#5e60ce",
      "#8593f3",
      "#a5b4fb",
      "#d0d9ff",
      "#d0d9ff",
    ],
    dataLabels: {
      enabled: true,
      textAnchor: "start",
      style: {
        colors: ["#fff"],
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex];
      },
      offsetX: 0,
      dropShadow: {
        enabled: true,
      },
    },
    stroke: {
      width: 0.5,
      colors: ["#fff"],
    },
    xaxis: {
      categories: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },

    legend: {
      show: false,
    },

    yaxis: {
      labels: {
        show: false,
      },
    },
    title: {
      text: "Popularity",
      align: "center",
      floating: true,
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
    },
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>

      {!shouldShow ? (
        <Spinner type="balls" />
      ) : (
        <>
          <ReactApexChart
            className="apex graph"
            options={options}
            series={series}
            type="bar"
            width={500}
            height={250}
          />
        </>
      )}
    </div>
  );
}

export default WeekdayGraph;
