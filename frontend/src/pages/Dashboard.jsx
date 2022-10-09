import React from "react";
import { useState, useEffect } from "react";
import GraphOrders from "../components/GraphOrders";
import Treemap from "../components/Treemap";
import Spinner from "../components/Spinner";
import icon from "./add-panel.svg";
import bulb from "./lightbulb.svg";
import "./dashboard.css";
import GraphSales from "../components/GraphSales";
import WeekdayGraph from "../components/WeekdayGraph";

function Dashboard(props) {
  const [showSpinner, setShowSpinner] = useState(false);
  const [hasUploaded, setHasUploaded] = useState(false);

  const getData = () => {
    console.log("Got data");

    setShowSpinner(true);

    sleep(1000).then(() => {
      setShowSpinner(false);
      setHasUploaded(true);
      console.log("Set show to true");
    });
  };

  useEffect(() => {
    console.log(`Has uploaded: ${hasUploaded}`);
  }, [hasUploaded]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="header">
          <img src={icon} width="50px" alt="logo" />
          <h1>Purple Analytics - Dashboard</h1>
          <label htmlFor="input">
            Upload
            <input id="input" type="file" accept=".csv" onChange={getData} />
          </label>
          <div className="header logout">
            <a href="/auth">logout</a>
          </div>
        </div>

        <div className="data body">
          {hasUploaded ? (
            <>
              <div className="statbar">
                <div className="statbar item">Next holiday: Christmas Day</div>
                <div className="statbar item">Most orders this week: 6</div>
                <div className="statbar item">
                  Worst performing item: Masala
                </div>
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
                <img src={bulb} width="35px" alt="logo" /> Insights
              </div>
              <div className="insights">
                <div className="insight item">Combos</div>
                <div className="insight item">
                  <Treemap title="Item Distribution" />
                </div>
                <div className="insight item">
                  <WeekdayGraph title="Week Days" />
                </div>
              </div>
            </>
          ) : showSpinner ? (
            <Spinner type="spinner" />
          ) : (
            <div className="noData">No data yet - upload your data above.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
