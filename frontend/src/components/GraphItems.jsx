import React, { useEffect } from "react";
import "../App.css";
import ReactApexChart from "react-apexcharts";

function GraphItems() {
  const [items, setItems] = React.useState("");
  const [quantity, setQuantity] = React.useState([]);

  function getData() {
    const Http = new XMLHttpRequest();
    const url = "http://127.0.0.1:8000/analytics/monthly_items";
    Http.open("GET", url);
    Http.send();

    Http.onreadystatechange = (e) => {
      console.log(Http.responseText);
      var text = Http.responseText;
      var start = text.indexOf("[");
      var end = text.indexOf("]");
      var sliced = text.slice(start + 1, end);
      text = text.substring(end + 1);
      var list = sliced.split(",");
      setItems(list);
      start = text.indexOf("[");
      end = text.indexOf("]");
      text = text.slice(start + 1, end);
      list = text.split(",");
      setQuantity(list);
    };
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
