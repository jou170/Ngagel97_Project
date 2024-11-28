import React from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const DailyTransactionReport = () => {
  // Data dummy
  const transactionData = [
    {
      no: 1,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 440.000,-",
    },
    {
      no: 2,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 320.000,-",
    },
    {
      no: 3,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 540.000,-",
    },
    {
      no: 4,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 840.000,-",
    },
    {
      no: 5,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 240.000,-",
    },
    {
      no: 6,
      offline: "Rp. 240.000,-",
      online: "Rp. 240.000,-",
      total: "Rp. 240.000,-",
    },
  ];

  return (
    <div style={{ backgroundColor: "#F4E1D2", minHeight: "100vh" }}>
      {/* Main Content */}
      <Box sx={{ padding: "80px 20px" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "#6d4c41" }}
        >
          Laporan Transaksi Harian
        </Typography>

        {/* Tabel Laporan */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>No</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Pendapatan Harian Offline
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Pendapatan Harian Online
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Total Pendapatan
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactionData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.no}</TableCell>
                  <TableCell>{row.offline}</TableCell>
                  <TableCell>{row.online}</TableCell>
                  <TableCell>{row.total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default DailyTransactionReport;
