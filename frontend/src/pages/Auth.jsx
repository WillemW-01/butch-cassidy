import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Spinner from "./site-spinner.png";
import "./auth.css";

function Auth(props) {
  const [username, setUsername] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [isError, setIsError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const navigation = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Username: ${username} | Restaurant: ${restaurant} | Email: ${email} 
    | Password: ${password} | Confirmed password: ${password2}`);

    if (password !== password2) {
      return setIsError(true);
    }

    props.setUsername(username);
    props.setRestaurant(restaurant);
    props.setEmail(email);
    props.setPassword(password);

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
          {isCorrect && (
            <img
              className="register body spinner"
              src={Spinner}
              alt="spinner"
            />
          )}
        </form>
      </div>
    </div>
  );
}

export default Auth;
