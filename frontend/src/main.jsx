import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API = "https://saas-backend-fr9j.onrender.com";

function App() {
  const [tenants, setTenants] = useState([]);
  const [products, setProducts] = useState([]);

  const loadTenants = async () => {
    const res = await
