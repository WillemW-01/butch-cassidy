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
  const [hasUploaded, setHasUploaded] = useState(true);

  const getData = () => {
    console.log("Got data");
    setShowSpinner(true);
    sleep(1000).then(() => {
      setShowSpinner(false);
      setHasUploaded(true);
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
    console.log(`Has uploaded: ${hasUploaded}`);
    getAverage();
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
                <div className="statbar item">
                  <div className="statbar item top">10.4</div>
                  <div className="statbar item bottom">
                    expected orders for today
                  </div>
                </div>
                <div className="statbar item">
                  <div className="statbar item top">
                    £{averageOrderValue} | {averageOrderQuantity} items
                  </div>
                  <div className="statbar item bottom">for average orders</div>
                </div>
                <div className="statbar item">
                  <div className="statbar item top">10% increase</div>
                  <div className="statbar item bottom">
                    expected orders for Monday
                  </div>
                </div>
                <div className="statbar item">
                  <div className="statbar item top">10% increase</div>
                  <div className="statbar item bottom">
                    expected orders for Monday
                  </div>
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
                  <WeekdayGraph title="Weekday" />
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
