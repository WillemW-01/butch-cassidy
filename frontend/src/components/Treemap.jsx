import React from "react";
import { useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import Spinner from "./Spinner";

import "./treeMap.css";

function Treemap(props) {
  const [graphData, setGraphData] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");

  const format = (data) => {
    if (data) {
      const items = data.items;
      const quantity = data.quantity;
      let tempFormat = items.map((item, index) => {
        return {
          x: item,
          y: quantity[index],
        };
      });

      // document.getElementById("searchInput").value = "";
      setSearchKey("");
      tempFormat = tempFormat.splice(0, Math.min(15, tempFormat.length));

      console.log("TEMP!");
      console.log(tempFormat);
      setGraphData(tempFormat);
      setShouldShow(true);
    }
  };

  const getData = () => {
    fetch("http://127.0.0.1:8000/analytics/top_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setItemList(data.items);
        format(data, 10);
      }
    );
  };

  const getGrouped = async (e) => {
    e.preventDefault();
    if (
      searchKey !== "" &&
      filteredData.length > 0 &&
      !filteredData.includes("No items")
    ) {
      const request = JSON.stringify({ key: searchKey });
      const response = await fetch(
        "http://127.0.0.1:8000/analytics/search_items",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: request,
        }
      );
      const data = await response.json();
      console.log(data);
      format(data);
    } else {
      console.log("Cant make search");
    }
  };

  useEffect(() => {
    if (graphData.length === 0) {
      getData();
    }
  }, []);

  const getFilteredData = (text) => {
    console.log(itemList);
    let tempData = itemList.filter((item) => {
      return text === "" ? "" : item.toLowerCase().includes(text);
    });
    console.log(tempData);
    tempData = tempData.splice(0, 5);
    if (tempData.length === 0) tempData = ["No items"];
    setFilteredData(tempData);
    setSearchKey(text);
  };

  const series = [
    {
      data: graphData,
    },
  ];
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
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
    colors: ["#0d053e", "#3b3b98", "#5e60ce", "#8593f3", "#a5b4fb", "#d0d9ff"],
  };

  return (
    <div className="chart">
      <h2>{props.title}</h2>

      {!shouldShow ? (
        <Spinner type="balls" />
      ) : (
        <>
          <form className="search" onSubmit={getGrouped}>
            <input
              type="text"
              id="searchInput"
              placeholder="check for an item type"
              onChange={(e) => getFilteredData(e.target.value)}
            />

            {searchKey !== "" && (
              <ul className="searchResults">
                {filteredData.map((item, index) => {
                  return <li key={index}>{item}</li>;
                })}
              </ul>
            )}
            <button type="submit">Search</button>
          </form>
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
