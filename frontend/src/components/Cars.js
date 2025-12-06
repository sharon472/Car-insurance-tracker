import React, { useEffect, useState } from "react";
import API from "../api";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [note, setNote] = useState(null);

  useEffect(() => {
    async function loadCars() {
      try {
        const res = await API.get("/cars");
        setCars(res.data);
      } catch (err) {
        setNote({ type: "error", text: "Failed to load cars" });
      }
    }
    loadCars();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!model.trim() || !year) {
      setNote({ type: "error", text: "Model and year required" });
      return;
    }
    try {
      const res = await API.post("/cars", { model, year: Number(year) });
      setCars([res.data, ...cars]);
      setModel(""); setYear("");
      setNote({ type: "success", text: "Car added!" });
      setTimeout(() => setNote(null), 3000);
    } catch {
      setNote({ type: "error", text: "Failed to add car" });
    }
  };

  return (
    <div className="card">
      <h2>🚘 Cars</h2>
      <form onSubmit={handleCreate} className="form-row">
        <input placeholder="Model" value={model} onChange={e=>setModel(e.target.value)} required />
        <input type="number" placeholder="Year" value={year} onChange={e=>setYear(e.target.value)} required />
        <button className="primary">Add</button>
      </form>
      {note && <div className={`notification ${note.type === "success" ? "success" : "error"}`}>{note.text}</div>}
      <div style={{marginTop:12}}>
        {cars.length === 0 ? <div className="small">No cars yet.</div> : 
          cars.map(c => (<div key={c.id} className="list-item"><strong>{c.model}</strong><div>Year: {c.year}</div><div className="small">ID: {c.id}</div></div>))
        }
      </div>
    </div>
  );
}

