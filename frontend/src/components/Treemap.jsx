import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

function Treemap() {
  const [graphData, setGraphData] = useState([]);
  const [showGraph, setShowGraph] = useState(false);

  const format = (data) => {
    if (data && graphData.length === 0) {
      const items = data.items;
      const quantity = data.quantity;
      console.log(items);
      console.log(quantity);
      console.log("Trying to make a treemap");

      const tempFormat = items.map((item, index) => {
        return {
          x: item,
          y: quantity[index],
        };
      });

      setGraphData(tempFormat);
    }
  };

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/monthly_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        format(data);
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setShowGraph(true);
  }, [graphData]);

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
      height: 1000,
      type: "treemap",
    },
    title: {
      text: "Order size Treemap",
    },
  };

  return (
    <>
      {!showGraph && <Spinner />}
      {showGraph && (
        <ReactApexChart
          options={options}
          series={series}
          type="treemap"
          height={500}
          width={1000}
        />
      )}
    </>
  );
}

export default Treemap;
