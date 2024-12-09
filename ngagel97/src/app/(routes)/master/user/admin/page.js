import React from "react";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

// const navItemStyle = {
//   color: "#fff",
//   cursor: "pointer",
//   fontSize: "16px",
//   fontWeight: "bold",
// };

const dummyData = [
  { email: "Budi@gmail.com", name: "Budi", role: "Admin", status: "Available" },
  { email: "Welly@gmail.com", name: "Welly", role: "Admin", status: "Ban" },
  { email: "Agus@gmail.com", name: "Agus", role: "Admin", status: "Ban" },
  { email: "Wati@gmail.com", name: "Wati", role: "Admin", status: "Available" },
  { email: "Vely@gmail.com", name: "Vely", role: "Admin", status: "Available" },
  { email: "Vely@gmail.com", name: "Vely", role: "Admin", status: "Available" },
];

const Page = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#F4E1D2",
        minHeight: "100vh",
        paddingTop: "80px",
      }}
    >
      {/* Main Content */}
      <Box sx={{ padding: "20px" }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ fontWeight: "bold", marginBottom: "20px", color: "#6d4c41" }}
        >
          Laporan Pengiriman
        </Typography>

        <TableContainer component={Paper} >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dummyData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === "Available" ? "success" : "error"}
                      sx={{ color: "#fff", fontWeight: "bold" }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default Page;
