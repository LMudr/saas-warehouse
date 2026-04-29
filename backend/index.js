import express from "express";
import cors from "cors";
import crypto from "crypto";

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- STORAGE (пока в памяти) ---
let tenants = [];
let products = [];
let sales = [];

// --- HEALTH ---
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// --- TENANTS ---
app.post("/admin/tenants", (req, res) => {
  const tenant = {
    id: crypto.randomUUID(),
    name: req.body.name || "Без названия"
  };

  tenants.push(tenant);
  res.json(tenant);
});

app.get("/admin/tenants", (req, res) => {
  res.json(tenants);
});

// --- PRODUCTS ---
app.post("/products", (req, res) => {
  const product = {
    id: crypto.randomUUID(),
    name: req.body.name,
    price: req.body.price
  };

  products.push(product);
  res.json(product);
});

app.get("/products", (req, res) => {
  res.json(products);
});

// --- SALES (🔥 ВАЖНО: с tenantId) ---
app.post("/sales", (req, res) => {
  const sale = {
    id: crypto.randomUUID(),
    tenantId: req.body.tenantId, // 👈 КЛЮЧЕВОЕ
    items: req.body.items || [],
    total: req.body.total || 0,
    createdAt: new Date()
  };

  sales.push(sale);
  res.json(sale);
});

app.get("/sales", (req, res) => {
  res.json(sales);
});

// --- START ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});
