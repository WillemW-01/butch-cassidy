import React from "react";
import { useState } from "react";

import "./timeOptions.css";

function TimeOptions(props) {
  const [intervalOpen, setIntervalOpen] = useState(false);
  const [intervalValue, setIntervalValue] = useState("weekly");

  const handleSubmit = (e) => {
    e.preventDefault();
    props.submit(intervalValue);
    setIntervalOpen(false);
  };

  return (
    <form className="options" onSubmit={handleSubmit}>
      <div className="options group">
        <label
          onClick={() => {
            setIntervalOpen(!intervalOpen);
          }}
        >
          Interval
        </label>
        {intervalOpen && (
          <div className="button group">
            <button type="submit" onClick={() => setIntervalValue("daily")}>
              Daily
            </button>
            <button type="submit" onClick={() => setIntervalValue("weekly")}>
              Weekly
            </button>
            <button type="submit" onClick={() => setIntervalValue("monthly")}>
              Monthly
            </button>
          </div>
        )}
      </div>
    </form>
  );
}

export default TimeOptions;
