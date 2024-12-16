"use client";
import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid, // Import Grid untuk layout
} from "@mui/material";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const DashboardPage = () => {
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get("/api/transaction/online/master");
      const transactionsArray = response.data.data.orders || [];

      const formattedTransactions = transactionsArray.map((transaction) => ({
        date: new Date(transaction.createdAt),
        total: transaction.total || 0,
      }));

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Aggregate data by month
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = transaction.date.toLocaleString("id-ID", { year: "numeric", month: "long" });
    acc[month] = (acc[month] || 0) + transaction.total;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Pendapatan Bulanan",
        data: Object.values(monthlyData),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Pendapatan Bulanan (Line Chart)",
        data: Object.values(monthlyData),
        fill: false,
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Statistik Pendapatan Bulanan",
      },
    },
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box
          sx={{
            bgcolor: "#b08968",
            p: 2,
            borderRadius: "4px 4px 0 0",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ color: "white" }}>
            Dashboard Penjualan
          </Typography>
        </Box>

        {/* Grid for placing the charts side by side */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Bar Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              {transactions.length === 0 ? (
                <Typography variant="h6" align="center" color="text.secondary">
                  Tidak ada data transaksi
                </Typography>
              ) : (
                <Bar data={chartData} options={chartOptions} />
              )}
            </Paper>
          </Grid>

          {/* Line Chart */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              {transactions.length === 0 ? (
                <Typography variant="h6" align="center" color="text.secondary">
                  Tidak ada data transaksi
                </Typography>
              ) : (
                <Line data={lineChartData} options={chartOptions} />
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default DashboardPage;
