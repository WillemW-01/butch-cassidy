import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

function Treemap(props) {
  const [graphData, setGraphData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

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
      setShowGraph(true);
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
        distributed: false,
        enableShades: true,
        shadeIntensity: 0.5,
      },
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
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>

      <ReactApexChart
        className="apex graph"
        options={options}
        series={series}
        type="treemap"
        width={500}
        height={250}
      />
    </div>
  );
}

export default Treemap;
