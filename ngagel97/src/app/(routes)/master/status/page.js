import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Chip,
  Container, // Added Container import
} from '@mui/material';

const users = [
  { email: 'Budi@gmail.com', name: 'Budi', role: 'Admin', status: 'Available' },
  { email: 'Welly@gmail.com', name: 'Welly', role: 'Admin', status: 'Ban' },
  { email: 'Agus@gmail.com', name: 'Agus', role: 'User', status: 'Ban' },
  { email: 'Wati@gmail.com', name: 'Wati', role: 'User', status: 'Available' },
  { email: 'Vely@gmail.com', name: 'Vely', role: 'Admin', status: 'Available' },
];

const StatusPage = () => {
  const getStatusColor = (status) => {
    return status === 'Available' ? '#4caf50' : '#f44336'; // Green for Available, Red for Ban
  };

  return (
    <div style={{ backgroundColor: "#F5E6D3", minHeight: "100vh", padding: "20px" }}>
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
            User Status Report
          </Typography>
        </Box>

        {/* Table */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#d7ccc8" }}>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:nth-of-type(odd)": { bgcolor: "#fafafa" },
                    }}
                  >
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        sx={{
                          backgroundColor: getStatusColor(user.status),
                          color: 'white',
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </div>
  );
};

export default StatusPage;
