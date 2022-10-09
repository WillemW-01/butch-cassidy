import React from "react";
import { useState } from "react";

import GraphOrders from "../components/GraphOrders";
import Treemap from "../components/Treemap";
import Spinner from "../components/Spinner";
import GraphSales from "../components/GraphSales";
import WeekdayGraph from "../components/WeekdayGraph";
import Combo from "../components/Combo";

import icon from "./add-panel.svg";
import bulb from "./bulb.svg";
import "./dashboard.css";

function Dashboard() {
  const [hasUploaded, setHasUploaded] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [averageOrder, setAverageOrder] = useState({});
  const [bestItem, setBestItem] = useState(0);
  const [expectedToday, setExpectedToday] = useState(0);
  const [ordersDifference, setOrdersDifference] = useState(0);

  const [statSpinner1, setStatSpinner1] = useState(false);
  const [statSpinner2, setStatSpinner2] = useState(false);
  const [statSpinner3, setStatSpinner3] = useState(false);
  const [statSpinner4, setStatSpinner4] = useState(false);

  const getData = () => {
    console.log("Got data");
    setShowSpinner(true);
    sleep(1500).then(() => {
      setShowSpinner(false);
      setHasUploaded(true);
      getAverage();
      getBestItem();
      getExpectedToday();
      getOrdersDifference();
      console.log("Set show to true");
    });
  };

  const getAverage = () => {
    setShowSpinner(false);
    fetch("http://127.0.0.1:8000/analytics/average_order").then(
      async (response) => {
        const data = await response.json();
        console.log(data);

        setAverageOrder({
          quantity: data.average.toFixed(1),
          value: data.sales,
        });
        setStatSpinner1(true);
      }
    );
  };

  const getBestItem = () => {
    setShowSpinner(false);
    fetch("http://127.0.0.1:8000/analytics/best_item").then(
      async (response) => {
        const data = await response.json();
        console.log(data);
        setBestItem(data.Tuesday);
        setStatSpinner2(true);
      }
    );
  };

  const getExpectedToday = () => {
    setShowSpinner(false);
    fetch("http://127.0.0.1:8000/analytics/expected_orders_today").then(
      async (response) => {
        const data = await response.json();
        console.log(data);

        setExpectedToday(data.prediction);
        setStatSpinner3(true);
      }
    );
  };

  const getOrdersDifference = () => {
    setShowSpinner(false);
    fetch("http://127.0.0.1:8000/analytics/expected_orders_change").then(
      async (response) => {
        const data = await response.json();
        console.log(data);

        setOrdersDifference(data.change);
        setStatSpinner4(true);
      }
    );
  };

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
                  {statSpinner1 ? (
                    <>
                      <div className="statbar item top">
                        £{averageOrder.value} | {averageOrder.quantity} items
                      </div>
                      <div className="statbar item bottom">
                        For an average order
                      </div>
                    </>
                  ) : (
                    <Spinner type="balls" />
                  )}
                </div>
                <div className="statbar item">
                  {statSpinner2 ? (
                    <>
                      <div className="statbar item top">{bestItem}</div>
                      <div className="statbar item bottom">
                        Best item yesterday
                      </div>
                    </>
                  ) : (
                    <Spinner type="balls" />
                  )}
                </div>
                <div className="statbar item">
                  {statSpinner3 ? (
                    <>
                      <div className="statbar item top">{expectedToday}</div>
                      <div className="statbar item bottom">
                        Expected orders for today
                      </div>
                    </>
                  ) : (
                    <Spinner type="balls" />
                  )}
                </div>
                <div className="statbar item">
                  {statSpinner4 ? (
                    <>
                      <div className="statbar item top">
                        {ordersDifference}%
                        {ordersDifference > 0 ? " increase" : " decrease"}
                      </div>
                      <div className="statbar item bottom">
                        Expected sales for tomorrow
                      </div>
                    </>
                  ) : (
                    <Spinner type="balls" />
                  )}
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
                <div className="insight item">
                  <Combo />
                </div>
                <div className="insight item">
                  <Treemap title="Item Distribution" />
                </div>
                <div className="insight item">
                  <WeekdayGraph
                    title="Order quantities per weekday"
                    hasUploaded={hasUploaded}
                  />
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
