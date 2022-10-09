import React, { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import TimeOptions from "./TimeOptions";
import Spinner from "./Spinner";
import "../App.css";

function GraphOrders(props) {
  const [date, setDate] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [predict_start, setPredict_start] = useState("");

  const submit = (interval) => {
    setShouldShow(false);

    const url = `http://127.0.0.1:8000/analytics/get_${interval}_quantities`;
    fetch(url).then(async (response) => {
      const data = await response.json();
      console.log(data);
      setDate(data.time);
      setQuantities(data.quantities);
      setPredict_start(data.predict_start);
      setShouldShow(true);
    });
  };

  useEffect(() => {
    submit("weekly");
  }, []);

  const series = [
    {
      name: "Quantity Sold",
      data: quantities,
    },
  ];
  const options = {
    chart: {
      id: "orders",
    },
    dataLabels: {
      enabled: false,
      style: {
        fontSize: "12px",
        fontFamily: "Helvetica, Arial, sans-serif",
      },
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
      colors: ["#7528b2"],
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
        gradientToColors: ["#8640BE", "#3D0082"],
        shadeIntensity: 1,
        type: "horizontal",
        opacityFrom: 0.2,
        opacityTo: 1,
        stops: [0, 100, 75, 75],
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date(predict_start).getTime(),
          x2: new Date(date[date.length - 1]).getTime(),
          borderColor: "#1F9DFC",
          yAxisIndex: 0,
          fillColor: "#1a005c7d",
        },
      ],
      // points: [
      //   {
      //     x: new Date(predict_start).getTime(),
      //     y: quantities[date.indexOf(new Date(predict_start).getTime())],
      //     marker: {
      //       size: 2,
      //       fillColor: "#1A005C",
      //     },
      //   },
      // ],
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
