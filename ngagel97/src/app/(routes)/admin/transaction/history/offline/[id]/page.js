"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Grid2,
  Card,
  CardContent,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useParams, useRouter } from "next/navigation";
import CenterLoading from "@/app/(routes)/(public)/components/CenterLoading";

const OfflineDetail = () => {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTransaction = async () => {
    try {
      const response = await fetch(`/api/transaction/online/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch transaction");
      }
      const data = await response.json();
      setOrder(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

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
              Detail Offline Transaction
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
            <strong>Order ID:</strong> {order.idTransaksi}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {order.status || "-"}
          </Typography>
          <Typography variant="body1">
            <strong>Total Harga:</strong> Rp. {order.total || "-"}
          </Typography>
        </CardContent>
      </Card>

      {/* List Barang */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Barang
      </Typography>
      {order.barang.length > 0 ? (
        <Grid2 container spacing={2}>
          {order.barang.map((item, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.nama}
                  </Typography>
                  <Typography variant="body1">
                    Jumlah: {item.qty}
                  </Typography>
                  <Typography variant="body1">
                    Harga: Rp. {item.harga}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1">Tidak Ada Barang</Typography>
      )}

      {/* List Jasa */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ marginTop: 4 }}>
        Jasa
      </Typography>
      {order.jasa.length > 0 ? (
        <Grid2 container spacing={2}>
          {order.jasa.map((jasa, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {jasa.nama}
                  </Typography>
                  <Typography variant="body1">
                    Sebanyak: {jasa.lembar} Lembar | Copy: {jasa.qty}
                  </Typography>
                  <Typography variant="body1">
                    Harga: Rp. {jasa.harga}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1">Tidak Ada Jasa</Typography>
      )}

      {/* Add-Ons */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ marginTop: 4 }}>
        Add-Ons
      </Typography>
      {order.addOns.length > 0 ? (
        <Grid2 container spacing={2}>
          {order.addOns.map((addOn, index) => (
            <Grid2 xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {addOn.nama}
                  </Typography>
                  <Typography variant="body1">
                    Jumlah: {addOn.qty}
                  </Typography>
                  <Typography variant="body1">
                    Harga: Rp. {addOn.harga}
                  </Typography>
                </CardContent>
              </Card>
            </Grid2>
          ))}
        </Grid2>
      ) : (
        <Typography variant="body1">Tidak Ada Add-ons</Typography>
      )}
    </Box>
  );
};

export default OfflineDetail;
