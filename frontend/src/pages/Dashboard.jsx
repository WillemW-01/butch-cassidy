import React from "react";
import GraphItems from "../components/GraphItems";

import GraphOrders from "../components/GraphOrders";

import "./dashboard.css";

function Dashboard() {
  return (
    <div className="container">
      <div className="dashboard">
        <div className="header">
          <h1>Dashboard</h1>
          <label for="input">
            Upload your data
            <input id="input" type="file" accept=".csv" />
          </label>
          <div className="header logout">
            <a href="/auth">logout</a>
          </div>
        </div>

        <div className="body">
          <GraphOrders />
          <GraphItems />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
