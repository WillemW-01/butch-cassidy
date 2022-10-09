import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasUploaded, setHasUploaded] = useState(false);

  const setDetails = (name, restaurant, email, psword) => {
    setUsername(name);
    setRestaurant(restaurant);
    setEmail(email);
    setPassword(psword);

    sendRestaurant(restaurant);
  };

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

  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth setDetails={setDetails} />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
