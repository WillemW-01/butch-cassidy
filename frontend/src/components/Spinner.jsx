import React from "react";
import spinnericon from "./site-spinner.png";

import "./spinner.css";

function Spinner() {
  return <img className="spinner" src={spinnericon} alt="spinner" />;
}

export default Spinner;
