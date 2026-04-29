import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-backend-fr9j.onrender.com";

function App() {
  // --- STATE ---
  const [sales, setSales] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  // --- LOAD ---
  const loadTenants = async () => {
    const res = await fetch(API + "/admin/tenants");
    setTenants(await res.json());
  };

  const loadProducts = async () => {
    const res = await fetch(API + "/products");
    setProducts(await res.json());
  };

  const loadSales = async () => {
    const res = await fetch(API + "/sales");
    setSales(await res.json());
  };

  useEffect(() => {
    loadTenants();
    loadProducts();
    loadSales();
  }, []);

  // --- TENANTS ---
  const createTenant = async () => {
    await fetch(API + "/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Мой бизнес" })
    });
    loadTenants();
  };

  // --- PRODUCTS ---
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

  // --- CART ---
  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // --- CHECKOUT ---
  const checkout = async () => {
    if (cart.length === 0) return;

    await fetch(API + "/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        total: total
      })
    });

    clearCart();
    loadSales();
  };

  // --- UI ---
  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800 }}>
      <h1>SaaS Склад 🚀</h1>

      {/* Компании */}
      <button
        onClick={createTenant}
        style={{
          padding: 10,
          background: "green",
          color: "white",
          borderRadius: 6,
          marginTop: 10
        }}
      >
        Создать компанию
      </button>

      <h2 style={{ marginTop: 30 }}>Компании</h2>
      <ul>
        {tenants.map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>

      {/* Товары */}
      <h2 style={{ marginTop: 30 }}>Товары</h2>

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
              onClick={() => addToCart(p)}
              style={{ marginLeft: 10 }}
            >
              +
            </button>
          </li>
        ))}
      </ul>

      {/* Чек */}
      <h2 style={{ marginTop: 30 }}>🧾 Чек</h2>

      {cart.length === 0 && <p>Чек пуст</p>}

      <ul>
        {cart.map((item, i) => (
          <li key={i}>
            {item.name} — {item.price}
            <button
              onClick={() => removeFromCart(i)}
              style={{ marginLeft: 10 }}
            >
              ❌
            </button>
          </li>
        ))}
      </ul>

      <h3>Итого: {total} грн</h3>

      <button onClick={checkout} style={{ marginTop: 10 }}>
        💰 Продать
      </button>

      <button onClick={clearCart} style={{ marginTop: 10, marginLeft: 10 }}>
        Очистить чек
      </button>

      {/* Продажи */}
      <h2 style={{ marginTop: 30 }}>📊 Продажи</h2>

      {sales.length === 0 && <p>Нет продаж</p>}

      <ul>
        {sales.map(s => (
          <li key={s.id}>
            {new Date(s.createdAt).toLocaleString()} — {s.total} грн
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
