import React from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-warehouse-production.up.railway.app";

function App(){
  return (
    <div style={{padding:20, fontFamily:"Arial"}}>
      <h1>SaaS Склад 🚀</h1>

      <button
        style={{
          padding: 12,
          background: "green",
          color: "white",
          border: "none",
          borderRadius: 8,
          marginTop: 20,
          cursor: "pointer"
        }}
        onClick={async () => {
          const res = await fetch(API + "/admin/tenants", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name: "Мой бизнес" })
          });

          const data = await res.json();
          alert("Создан tenant: " + data.id);
        }}
      >
        Создать компанию
      </button>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
