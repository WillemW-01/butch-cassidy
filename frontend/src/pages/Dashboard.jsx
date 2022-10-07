import React from "react";

import Graph from "../components/Graph";

import "./dashboard.css";

function Dashboard() {
  return (
    <div className="container">
      <div className="dashboard">
        <div className="header">
          <h1>Dashboard</h1>
          <button>+</button>
          <a href="/auth">logout</a>
        </div>

        <div className="body">
          <Graph />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
