import React, { useEffect, useState } from "react";
import API from "../api";

export default function Insurances() {
  const [insurances, setInsurances] = useState([]);
  const [users, setUsers] = useState([]);
  const [cars, setCars] = useState([]);
  const [type, setType] = useState("");
  const [userId, setUserId] = useState("");
  const [carId, setCarId] = useState("");
  const [company, setCompany] = useState("");
  const [note, setNote] = useState(null);

  const companies = ["Company A", "Company B", "Company C"];

  useEffect(()=>{ loadAll(); }, []);

  async function loadAll() {
    try {
      const [insRes, usersRes, carsRes] = await Promise.all([
        API.get("/insurances"),
        API.get("/users"),
        API.get("/cars"),
      ]);
      setInsurances(insRes.data); setUsers(usersRes.data); setCars(carsRes.data);
    } catch { setNote({ type:"error", text:"Failed to load data"}); }
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!type || !userId || !carId || !company) {
      setNote({ type:"error", text:"All fields required" });
      return;
    }
    try {
      const res = await API.post("/insurances", { type, user_id:Number(userId), car_id:Number(carId), company });
      setInsurances([res.data, ...insurances]);
      setType(""); setUserId(""); setCarId(""); setCompany("");
      setNote({ type:"success", text:"Insurance added!" });
      setTimeout(()=>setNote(null),3000);
    } catch { setNote({ type:"error", text:"Failed to add insurance"}); }
  }

  return (
    <div className="card">
      <h2>🛡️ Insurances</h2>
      <form onSubmit={handleCreate} className="form-row">
        <input placeholder="Policy Type" value={type} onChange={e=>setType(e.target.value)} required />
        <select value={userId} onChange={e=>setUserId(e.target.value)} required>
          <option value="">Select User</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <select value={carId} onChange={e=>setCarId(e.target.value)} required>
          <option value="">Select Car</option>
          {cars.map(c => <option key={c.id} value={c.id}>{c.model} ({c.year})</option>)}
        </select>
        <select value={company} onChange={e=>setCompany(e.target.value)} required>
          <option value="">Select Company</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="primary">Add</button>
      </form>
      {note && <div className={`notification ${note.type==="success"?"success":"error"}`}>{note.text}</div>}
      <div style={{marginTop:12}}>
        {insurances.length===0 ? <div className="small">No insurances yet</div> :
          insurances.map(i => (
            <div key={i.id} className="list-item">
              <strong>{i.type}</strong>
              <div className="small">User ID: {i.user_id} • Car ID: {i.car_id} • Company: {i.company}</div>
              <div className="small">ID: {i.id}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

