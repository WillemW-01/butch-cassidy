import React from "react";
import { useState, useEffect } from "react";
import GraphOrders from "../components/GraphOrders";
import Treemap from "../components/Treemap";
import Spinner from "../components/Spinner";
import icon from "./add-panel.svg";
import bulb from "./bulb.svg";
import "./dashboard.css";
import GraphSales from "../components/GraphSales";
import WeekdayGraph from "../components/WeekdayGraph";

function Dashboard(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [averageOrderQuantity, setAverageOrderQuantity] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);

  const getData = () => {
    console.log("Got data");
    setShowSpinner(true);
    sleep(1000).then(() => {
      setShowSpinner(false);
      // props.setHasUploaded(true);
      console.log("Set show to true");
    });
  };

  const getAverage = () => {
    setShowSpinner(false);
    fetch("http://127.0.0.1:8000/analytics/average_order").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setAverageOrderQuantity(data.average);
        setAverageOrderValue(data.sales);
        setShowSpinner(true);
      }
    );
  };

  useEffect(() => {
    console.log(`Has uploaded: ${props.hasUploaded}`);
    getAverage();
  }, [props.hasUploaded]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="header">
          <img src={icon} width="50px" alt="logo" />
          <h1>Dashboard</h1>
          <label htmlFor="input">
            Upload your data
            <input id="input" type="file" accept=".csv" onChange={getData} />
          </label>
          <div className="header logout">
            <a href="/auth">logout</a>
          </div>
        </div>

        <div className="data body">
          {/* {props.hasUploaded && ( */}
          <>
            <div className="statbar">
              <div className="statbar item">Next holiday: Christmas Day</div>
              <div className="statbar item">
                <label>Averages:</label>
                <label>Orders: {averageOrderQuantity}</label>
                <label>Sales: ${averageOrderValue}</label>
              </div>
              <div className="statbar item">Worst performing item: Masala</div>
            </div>
            <div className="section header"></div>
            <div className="main">
              <div className="main graph one">
                <GraphOrders title="Quantities Sold" />
              </div>
              <div className="main graph two">
                <GraphSales title="Sales" />
              </div>
            </div>
            <div className="section header">
              <img src={bulb} width="50px" alt="logo" /> Insights
            </div>
            <div className="insights">
              <div className="insight item">Combos</div>
              <div className="insight item">
                <Treemap title="Item Distribution" />
              </div>
              <div className="insight item">
                <WeekdayGraph title="Weekday" />
              </div>
            </div>
          </>
          {/* )} */}
        </div>

        {showSpinner && <Spinner />}
      </div>
    </div>
  );
}

export default Dashboard;
