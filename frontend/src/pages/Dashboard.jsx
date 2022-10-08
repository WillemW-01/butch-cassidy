import React from "react";
import { useState, useEffect } from "react";

import GraphItems from "../components/GraphItems";
import GraphOrders from "../components/GraphOrders";
import Treemap from "../components/Treemap";
import Spinner from "../components/Spinner";

import icon from "./add-panel.svg";

import "./dashboard.css";

function Dashboard(props) {
  const [showSpinner, setShowSpinner] = useState(false);

  const getData = () => {
    console.log("Got data");

    setShowSpinner(true);

    sleep(1000).then(() => {
      setShowSpinner(false);
      // props.setHasUploaded(true);
      console.log("Set show to true");
    });
  };

  useEffect(() => {
    console.log(`Has uploaded: ${props.hasUploaded}`);
  }, [props.hasUploaded]);

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  return (
    <div className="container">
      <div className="dashboard">
        <div className="header">
          <img src={icon} width="50px" />
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
              <div className="statbar item">StatItem</div>
              <div className="statbar item">StatItem</div>
              <div className="statbar item">StatItem</div>
            </div>
            <div className="section header">Main graphs</div>
            <div className="main">
              <div className="main graph one">
                <GraphOrders title="Quantities Sold" />
              </div>
              <div className="main graph two">Graph2</div>
            </div>
            <div className="section header">Insights</div>
            <div className="insights">
              <div className="insight item">Insight1</div>
              <div className="insight item">Insight2</div>
              <div className="insight item">Insight3</div>
              {/* <Treemap /> */}
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
