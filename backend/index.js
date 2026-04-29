import cors from "cors";
import express from "express";
import crypto from "crypto";

const app = express();
app.use(cors());
app.use(express.json());

let tenants = [];
let products = [];

app.get("/health", (req,res)=>res.json({ok:true}));

app.post("/admin/tenants",(req,res)=>{
  const t = {id:crypto.randomUUID(), ...req.body};
  tenants.push(t);
  res.json(t);
});

app.get("/admin/tenants",(req,res)=>{
  res.json(tenants);
});

app.post("/products",(req,res)=>{
  const p = {id:crypto.randomUUID(), ...req.body};
  products.push(p);
  res.json(p);
});

app.get("/products",(req,res)=>{
  res.json(products);
});

app.listen(3000, ()=>console.log("backend running"));
