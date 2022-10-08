import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

function Treemap(props) {
  const [graphData, setGraphData] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);

  const format = (data) => {
    if (data && graphData.length === 0) {
      const items = data.items;
      const quantity = data.quantity;
      const tempFormat = items.map((item, index) => {
        return {
          x: item,
          y: quantity[index],
        };
      });

      setGraphData(tempFormat);
      setShouldShow(true);
    }
  };

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/monthly_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        format(data, 10);
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const series = [
    {
      data: graphData,
    },
  ];
  const options = {
    plotOptions: {
      treemap: {
        distributed: true,
        enableShades: true,
        shadeIntensity: 0.1,
      },
    },
    dataLabels: {
      enabled: true,
    },
    legend: {
      show: false,
    },
    chart: {
      type: "treemap",
    },
    title: {
      text: "",
    },
    colors: ["#231c4b", "#3b3b98", "#5e60ce", "#8593f3", "#a5b4fb", "#d0d9ff"],
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
            type="treemap"
            width={500}
            height={250}
          />
        </>
      )}
    </div>
  );
}

export default Treemap;
