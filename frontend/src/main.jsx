import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-backend-fr9j.onrender.com";

function App() {
  const [tenants, setTenants] = useState([]);
  const [products, setProducts] = useState([]);

  const loadTenants = async () => {
    const res = await fetch(API + "/admin/tenants");
    const data = await res.json();
    setTenants(data);
  };

  useEffect(() => {
    loadTenants();
  }, []);

  const createTenant = async () => {
    const res = await fetch(API + "/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Мой бизнес" })
    });

    await res.json();
    loadTenants();
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SaaS Склад 🚀</h1>

      <button
        onClick={createTenant}
        style={{
          padding: 12,
          background: "green",
          color: "white",
          border: "none",
          borderRadius: 8,
          marginTop: 20,
          cursor: "pointer"
        }}
      >
        Создать компанию
      </button>

      <h2 style={{ marginTop: 30 }}>Компании:</h2>

      <ul>
        {tenants.map(t => (
          <li key={t.id}>{t.name} ({t.id})</li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
