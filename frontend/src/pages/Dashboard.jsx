import React from "react";

import Graph from "../components/Graph";

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
          <Graph />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
