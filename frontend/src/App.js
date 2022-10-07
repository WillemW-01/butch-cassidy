import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="body">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Auth
                setUsername={setUsername}
                setRestaurant={setRestaurant}
                setEmail={setEmail}
                setPassword={setPassword}
              />
            }
          />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
