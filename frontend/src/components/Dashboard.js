import React, { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, cars: 0, insurances: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [usersRes, carsRes, insRes] = await Promise.all([
          API.get("/users"),
          API.get("/cars"),
          API.get("/insurances")
        ]);
        setStats({ users: usersRes.data.length, cars: carsRes.data.length, insurances: insRes.data.length });
      } catch (err) {
        console.error("Failed to load stats", err);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="card">
      <h2>📊 Dashboard</h2>
      <div className="list-item"><strong>Users:</strong> {stats.users}</div>
      <div className="list-item"><strong>Cars:</strong> {stats.cars}</div>
      <div className="list-item"><strong>Insurances:</strong> {stats.insurances}</div>
    </div>
  );
}
