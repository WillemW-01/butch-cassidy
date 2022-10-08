import React, { useState, useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";
import TimeOptions from "./TimeOptions";
import Spinner from "./Spinner";

function GraphSales(props) {
  const [date1, setDate1] = useState([]);
  const [sales, setSales] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);

  const submit = (pastValue, futureValue, interval) => {
    setShouldShow(false);
    console.log(
      `Got past: ${pastValue} and future: ${futureValue} and interval: ${interval}`
    );
    fetch(`http://127.0.0.1:8000/analytics/calculate_${interval}_sales`).then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setDate1(data.time);
        setSales(data.sales);
        setShouldShow(true);
      }
    );
  };

  useEffect(() => {
    submit(0, 0, "monthly");
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
      width: 3,
      curve: "straight",
      colors: ["#8640BE"],
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
            width={500}
            height={300}
          />
        </>
      )}
    </div>
  );
}

export default GraphSales;
