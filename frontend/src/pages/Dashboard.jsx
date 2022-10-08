import React from "react";
import { useState, useEffect } from "react";

import GraphItems from "../components/GraphItems";
import GraphOrders from "../components/GraphOrders";

import "./dashboard.css";
import Spinner from "./site-spinner.png";

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
          <h1>Dashboard</h1>
          <label htmlFor="input">
            Upload your data
            <input id="input" type="file" accept=".csv" onChange={getData} />
          </label>
          <div className="header logout">
            <a href="/auth">logout</a>
          </div>
        </div>

        <div className="body">
          {/* {props.hasUploaded && ( */}
          <>
            <div className="main data">
              <GraphOrders />
            </div>
            <div className="insights">
              <GraphItems />
            </div>
          </>
          {/* )} */}
        </div>

        {showSpinner && (
          <img className="register body spinner" src={Spinner} alt="spinner" />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
