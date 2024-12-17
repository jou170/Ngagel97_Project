"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Tooltip,
  Grid2,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams, useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState(null);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transaction/online/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setOrder(data.data);

      const userResponse = await fetch(`/api/user/${data.data.userId}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      setUser(userData.data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const handleOpenDialog = (type) => {
    setActionType(type);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setActionType(null);
  };

  const updateOrderStatus = async () => {
    if (!actionType) return;
    const newStatus = actionType === "deliver" ? "progress" : "completed";

    try {
      const response = await fetch(`/api/transaction/online/${order._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      const updatedOrder = await response.json();

      if (newStatus === "completed") {
        router.push("/admin/order");
      } else {
        fetchTransaction();
      }
    } catch (err) {
      console.error("Error updating order status:", err.message);
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) return <CenterLoading />;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box sx={{ backgroundColor: "#D6C0B3", minHeight: "100vh", padding: 4 }}>
      {/* Header Section */}
      <Box mb={4}>
        <Grid2 container alignItems="center" spacing={2}>
          <Grid2 xs={12} sm={6}>
            <IconButton
              onClick={() => router.push("/admin/transaction/history")}
              sx={{ backgroundColor: "#D6C0B3" }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Grid2>
          <Grid2 xs={12} sm={6}>
            <Typography variant="h4" fontWeight="bold">
              Detail History
            </Typography>
          </Grid2>
        </Grid2>
      </Box>

      {/* Order Details */}
      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Order Information
          </Typography>
          <Typography variant="body1">
            <strong>Order ID:</strong> {order._id}
          </Typography>
          <Typography variant="body1">
            <strong>Nama Pemesan:</strong> {user?.name || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Nomor Telepon:</strong> {user?.phone_number || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Alamat:</strong> {order.alamat || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Catatan:</strong> {order.notes || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Total Harga:</strong> Rp. {order.total || "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* List Jasa */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Services and Add-Ons
      </Typography>
      <Grid2 container spacing={2}>
        {order.jasa.map((jasa, index) => (
          <Grid2 xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              elevation={3}
              sx={{
                width: 637,
                height: 250,
                position: "relative",
              }}
            >
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {jasa.nama}
                </Typography>
                <Typography variant="body1">
                  Sebanyak: {jasa.lembar} Lembar | Jumlah Copy: {jasa.qty} | Harga: Rp. {jasa.harga}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: 1 }}
                >
                  Notes: {jasa.notes || "-"}
                </Typography>
                {jasa.addOns.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Add-Ons:
                    </Typography>
                    {jasa.addOns.map((addOn, idx) => (
                      <Typography key={idx} variant="body2">
                        - {addOn.nama} dengan jumlah tiap{" "}
                        {addOn.tipeHarga === "lembar" ? "lembar" : "copy"}{" "}
                        {addOn.qty}{" "}
                        seharga Rp. {addOn.harga}{" "}
                      </Typography>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
};

export default TransactionDetailPage;
