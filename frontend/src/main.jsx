import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-backend-fr9j.onrender.com";

function App() {
  // --- STATE ---
  const [sales, setSales] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  const [selectedTenant, setSelectedTenant] = useState("");
  const [tenantName, setTenantName] = useState("");

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  // --- LOAD ---
  const loadTenants = async () => {
    const res = await fetch(API + "/admin/tenants");
    const data = await res.json();
    setTenants(data);

    if (data.length > 0 && !selectedTenant) {
      setSelectedTenant(data[0].id);
    }
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
    if (!tenantName) return;

    await fetch(API + "/admin/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: tenantName })
    });

    setTenantName("");
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
    if (cart.length === 0 || !selectedTenant) return;

    await fetch(API + "/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId: selectedTenant,
        items: cart,
        total: total
      })
    });

    clearCart();
    loadSales();
  };

  // --- FILTER SALES ---
  const filteredSales = sales.filter(
    s => s.tenantId === selectedTenant
  );

  // --- UI ---
  return (
    <div style={{ padding: 20, fontFamily: "Arial", maxWidth: 800 }}>
      <h1>SaaS Склад 🚀</h1>

      {/* ВЫБОР КОМПАНИИ */}
      <h2>Текущая компания</h2>

      <select
        value={selectedTenant}
        onChange={e => setSelectedTenant(e.target.value)}
      >
        {tenants.map(t => (
          <option key={t.id} value={t.id}>
            {t.name}
          </option>
        ))}
      </select>

      {/* СОЗДАНИЕ КОМПАНИИ */}
      <div style={{ marginTop: 10 }}>
        <input
          placeholder="Новая компания"
          value={tenantName}
          onChange={e => setTenantName(e.target.value)}
        />

        <button onClick={createTenant} style={{ marginLeft: 10 }}>
          Создать
        </button>
      </div>

      {/* ТОВАРЫ */}
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

      {/* ЧЕК */}
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

      {/* ПРОДАЖИ */}
      <h2 style={{ marginTop: 30 }}>📊 Продажи</h2>

      {filteredSales.length === 0 && <p>Нет продаж</p>}

      <ul>
        {filteredSales.map(s => (
          <li key={s.id}>
            {new Date(s.createdAt).toLocaleString()} — {s.total} грн
          </li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
