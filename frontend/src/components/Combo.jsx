import React from "react";
import { useEffect } from "react";
import { useState } from "react";

import "./combo.css";
import Spinner from "./Spinner";

function Combo() {
  const [itemList, setItemList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [results, setResults] = useState([]);

  const getData = async () => {
    fetch("http://127.0.0.1:8000/analytics/top_items").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setItemList(data.items);
      }
    );

    const request = JSON.stringify({ key: "Chicken" });
    const response = await fetch(
      "http://127.0.0.1:8000/analytics/search_combos",
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
    setResults(data.combos.split(","));
    setShouldShow(true);
  };

  useEffect(() => {
    if (itemList.length === 0) {
      getData();
    }
    // eslint-disable-next-line
  }, []);

  const getCombos = async (e) => {
    e.preventDefault();
    if (
      searchKey !== "" &&
      filteredData.length > 0 &&
      !filteredData.includes("No items")
    ) {
      setSearchKey("");
      setShouldShow(false);
      const request = JSON.stringify({ key: searchKey });
      const response = await fetch(
        "http://127.0.0.1:8000/analytics/search_combos",
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
      setResults(data.search_list.split(","));
      setShouldShow(true);
    } else {
      console.log("Cant make search");
    }
  };

  // const sleep = (milliseconds) => {
  //   return new Promise((resolve) => setTimeout(resolve, milliseconds));
  // };

  const getFilteredData = (text) => {
    let tempData = itemList.filter((item) => {
      return text === "" ? "" : item.toLowerCase().includes(text);
    });
    tempData = tempData.splice(0, 5);
    if (tempData.length === 0) tempData = ["No items"];
    setFilteredData(tempData);
    setSearchKey(text);
  };

  return (
    <div className="chart">
      <h2>Frequently bought together</h2>

      <form className="search" onSubmit={getCombos}>
        <input
          type="text"
          id="searchInput"
          placeholder="enter a product name"
          onChange={(e) => getFilteredData(e.target.value)}
          autoComplete="off"
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

      {shouldShow ? (
        <table className="comboResults">
          <th>Commonly bought together:</th>
          {results.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item}</td>
              </tr>
            );
          })}
        </table>
      ) : (
        <Spinner type="balls" />
      )}
    </div>
  );
}

export default Combo;
