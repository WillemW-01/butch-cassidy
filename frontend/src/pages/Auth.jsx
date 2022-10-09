import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "../components/Spinner";
import logo from "./add-panel.svg";

import "./auth.css";

function Auth() {
  const [username, setUsername] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isError, setIsError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const navigation = useNavigate();

  const sendRestaurant = async (restaurant) => {
    if (restaurant) {
      console.log(`Sending: ${restaurant}`);
      await fetch("http://127.0.0.1:8000/analytics/sign_up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ restaurant: restaurant }),
      }).then((response) => {
        const data = response.json();
      });
    } else {
      console.log("Cant send restaurant name");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Username: ${username} | Restaurant: ${restaurant} | Email: ${email} 
    | Password: ${password} | Confirmed password: ${password2}`);

    if (!(username || restaurant || email || password || password2)) {
      return;
    } else if (password !== password2) {
      return setIsError(true);
    }

    sendRestaurant(restaurant);

    setIsCorrect(true);

    sleep(1000).then(() => {
      navigation("/dashboard");
      setIsCorrect(false);
    });
  };

  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  return (
    <div className="container">
      <div className="logo">
        <img src={logo} height="50px"></img>
        <h1>Purple Analytics</h1>
      </div>
      <div className="register">
        <div className="register label">
          <h2>Register a new account</h2>
          <span>
            Already have an account? <a href="/">Login here</a>
          </span>
        </div>
        <form onSubmit={handleSubmit} className="register body">
          <fieldset>
            <legend>Enter your username</legend>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Enter your restaurant name</legend>
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Enter your email</legend>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Enter your password</legend>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Confirm your password </legend>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
            />
          </fieldset>
          {isError && (
            <span className="error">Passwords don't match, try again</span>
          )}
          <button type="submit">Register</button>
          {isCorrect && <Spinner />}
        </form>
      </div>
    </div>
  );
}

export default Auth;
