import React, { useState } from "react";
import Users from "./components/Users";
import Cars from "./components/Cars";
import Insurances from "./components/Insurances";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [adminLogged, setAdminLogged] = useState(false);

  return (
    <div className="container">
      <h1 className="title">🚗 Car Insurance Tracker</h1>
      
      {!adminLogged ? (
        <Users setAdminLogged={setAdminLogged} />
      ) : (
        <>
          <Dashboard />
          <div className="grid">
            <Cars />
            <Insurances />
          </div>
        </>
      )}

      <footer className="footer">Built with ❤️ • Theme: orange • black • white • blue</footer>
    </div>
  );
}


