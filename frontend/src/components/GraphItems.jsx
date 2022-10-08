import React, { useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function GraphItems() {
  const [items, setItems] = React.useState("");
  const [quantity, setQuantity] = React.useState([]);

  function getData() {
    fetch("http://127.0.0.1:8000/analytics/monthly_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setItems(data.Item);
        setQuantity(data.Quantity);
      }
    );
  }

  useEffect(() => {
    getData();
  }, []);

  // plot graph of items and quantity
  const options = {
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: items,
    },

    title: {
      text: "Item Popularity",
      align: "center",
      margin: 20,
      offsetY: 20,
      style: {
        fontSize: "25px",
      },
    },
    // add color to the bars
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },

    dataLabels: {
      enabled: false,
    },
  };

  const series = [
    {
      name: "Quantity",
      data: quantity,
    },
  ];

  return (
    <div className="graph">
      <ReactApexChart
        // name graph
        options={options}
        series={series}
        type="bar"
        height={500}
      />
    </div>
  );
}

export default GraphItems;
