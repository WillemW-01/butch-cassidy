import React from "react";
import { useState } from "react";

import "./timeOptions.css";

function TimeOptions(props) {
  const [pastOpen, setPastOpen] = useState(false);
  const [pastValue, setPastValue] = useState(12);

  const [futureOpen, setFutureOpen] = useState(false);
  const [futureValue, setFutureValue] = useState(12);

  const [intervalOpen, setIntervalOpen] = useState(false);
  const [intervalValue, setIntervalValue] = useState("week");

  const handleSubmit = (e) => {
    e.preventDefault();
    e.target.style["background-color"] = "#453892";
    e.target.style["border-color"] = "#453892";
    props.submit(pastValue, futureValue);
  };

  return (
    <form className="options" onSubmit={handleSubmit}>
      <div className="options group">
        <label
          onClick={() => {
            setPastOpen(!pastOpen);
            setFutureOpen(false);
            setIntervalOpen(false);
          }}
        >
          Past
        </label>
        {pastOpen && (
          <div className="button group">
            <button type="submit" onClick={() => setPastValue(1)}>
              1 Month
            </button>
            <button type="submit" onClick={() => setPastValue(3)}>
              3 Months
            </button>
            <button type="submit" onClick={() => setPastValue(6)}>
              6 Months
            </button>
            <button type="submit" onClick={() => setPastValue(12)}>
              12 Months
            </button>
          </div>
        )}
      </div>
      <div className="options group">
        <label
          onClick={() => {
            setFutureOpen(!futureOpen);
            setPastOpen(false);
            setIntervalOpen(false);
          }}
        >
          Predict
        </label>
        {futureOpen && (
          <div className="button group">
            <button type="submit" onClick={() => setFutureValue(1)}>
              1 Month
            </button>
            <button type="submit" onClick={() => setFutureValue(3)}>
              3 Months
            </button>
            <button type="submit" onClick={() => setFutureValue(6)}>
              6 Months
            </button>
            <button type="submit" onClick={() => setFutureValue(12)}>
              12 Months
            </button>
          </div>
        )}
      </div>
      <div className="options group">
        <label
          onClick={() => {
            setIntervalOpen(!intervalOpen);
            setPastOpen(false);
            setFutureOpen(false);
          }}
        >
          Interval
        </label>
        {intervalOpen && (
          <div className="button group">
            <button type="submit" onClick={() => setIntervalValue("day")}>
              Daily
            </button>
            <button type="submit" onClick={() => setFutureValue("week")}>
              Weekly
            </button>
            <button type="submit" onClick={() => setFutureValue("month")}>
              Monthly
            </button>
            <button type="submit" onClick={() => setFutureValue("year")}>
              Yearly
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default TimeOptions;