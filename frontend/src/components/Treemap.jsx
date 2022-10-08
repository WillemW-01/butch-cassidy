import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

function Treemap() {
  const [graphData, setGraphData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const format = (data) => {
    if (data && graphData.length === 0) {
      const { items, quantity } = data.items;
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
    legend: {
      show: false,
    },
    chart: {
      type: "treemap",
    },
    title: {
      text: "Order size Treemap",
    },
  };

  return (
    <>
      {showGraph ? (
        <ReactApexChart options={options} series={series} type="treemap" />
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default Treemap;
