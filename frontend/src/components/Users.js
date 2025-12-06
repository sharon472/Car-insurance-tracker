import React, { useState } from "react";

export default function Users({ setAdminLogged }) {
  const [password, setPassword] = useState("");
  const [note, setNote] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    const adminPassword = "admin123"; // hardcoded password for simplicity
    if (password === adminPassword) {
      setAdminLogged(true);
    } else {
      setNote({ type: "error", text: "Incorrect password" });
    }
  };

  return (
    <div className="card">
      <h2>🔒 Admin Login</h2>
      <form onSubmit={handleLogin} className="form-row">
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary">Login</button>
      </form>
      {note && (
        <div className={`notification ${note.type === "error" ? "error" : "success"}`}>{note.text}</div>
      )}
    </div>
  );
}



