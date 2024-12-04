"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";

const AddOnPage = () => {
  const [addOns, setAddOns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const response = await fetch("/api/addon"); // Update with your API URL
        const data = await response.json();
        setAddOns(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil data add-ons:", error);
        setLoading(false);
      }
    };

    fetchAddOns();
  }, []);

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Koleksi Add-On</h1>
      <div style={styles.grid}>
        {addOns.map((addon) => (
          <div key={addon._id} style={styles.card}>
            {addon.gambar && (
              <Image
                src={addon.gambar}
                alt={addon.nama || "Gambar Addon"} // Memberikan fallback jika nama tidak ada
                style={styles.image}
                width={100}
                height={100}
              />
            )}
            <h2 style={styles.name}>{addon.nama}</h2>
            <p style={styles.text}>Harga: Rp{addon.harga}</p>
            <p style={styles.text}>Tipe Harga: {addon.tipeHarga}</p>
            <p style={styles.text}>{addon.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#333",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    transition: "transform 0.2s ease-in-out",
  },
  cardHover: {
    transform: "translateY(-5px)",
  },
  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  name: {
    fontSize: "1.5rem",
    margin: "10px",
    color: "#555",
  },
  text: {
    margin: "10px",
    fontSize: "1rem",
    color: "#666",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.5rem",
    color: "#777",
  },
};

export default AddOnPage;
