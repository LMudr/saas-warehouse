import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-backend-fr9j.onrender.com";

function App() {
  const [tenants, setTenants] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const loadTenants = async () => {
    const res = await fetch(API + "/admin/tenants");
    const data = await res.json();
    setTenants(data);
  };

  const loadProducts = async () => {
    const res = await fetch(API + "/products");
    const data = await res.json();
    setProducts(data);
  };

  const addToCart = (product) => {
  setCart(prev => [...prev, product]);
};

const total = cart.reduce((sum, item) => sum + item.price, 0);
  
  const createTenant = async () => {
    await fetch(API + "/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Мой бизнес" })
    });

    loadTenants();
  };

  const createProduct = async () => {
    if (!productName || !productPrice) return;

    await fetch(API + "/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productName,
        price: Number(productPrice)
      })
    });

    setProductName("");
    setProductPrice("");

    loadProducts();
  };

  useEffect(() => {
    loadTenants();
    loadProducts();
  }, []);

  return (
  <div style={{ padding: 20, fontFamily: "Arial" }}>
    <h1>SaaS Склад 🚀</h1>

    <button onClick={createTenant} style={{ padding: 12, background: "green", color: "white", borderRadius: 8 }}>
      Создать компанию
    </button>

    <h2 style={{ marginTop: 30 }}>Компании:</h2>
    <ul>
      {tenants.map(t => (
        <li key={t.id}>{t.name}</li>
      ))}
    </ul>

    <h2 style={{ marginTop: 30 }}>Товары:</h2>

    <div style={{ marginBottom: 10 }}>
      <input
        placeholder="Название"
        value={productName}
        onChange={e => setProductName(e.target.value)}
      />

      <input
        placeholder="Цена"
        value={productPrice}
        onChange={e => setProductPrice(e.target.value)}
        style={{ marginLeft: 10 }}
      />

      <button onClick={createProduct} style={{ marginLeft: 10 }}>
        Добавить
      </button>
    </div>

    <ul>
      {products.map(p => (
        <li key={p.id}>
          {p.name} — {p.price}
          <button
            style={{ marginLeft: 10 }}
            onClick={() => addToCart(p)}
          >
            +
          </button>
        </li>
      ))}
    </ul>

    <h2 style={{ marginTop: 30 }}>🧾 Чек:</h2>

    <ul>
      {cart.map((item, i) => (
        <li key={i}>
          {item.name} — {item.price}
        </li>
      ))}
    </ul>

    <h3>Итого: {total} грн</h3>
  </div>
);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
