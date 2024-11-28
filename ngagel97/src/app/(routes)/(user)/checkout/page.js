import React from "react";
import {
  Box,
  TextField,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
} from "@mui/material";

const CheckoutPage = () => {
  const dummyData = [
    { id: 1, name: "Print Kertas HVS (1 Lembar)", price: 10000 },
    { id: 2, name: "Print Kertas Folio (1 Lembar)", price: 10000 },
    { id: 3, name: "Print Kertas Folio Berwarna (1 Lembar)", price: 10000 },
  ];

  const totalItems = dummyData.length;
  const totalPrice = dummyData.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = 12000;

  return (
    <Box display="flex" p={4} gap={4}>
      {/* Left Section */}
      <Box flex={1}>
        <Typography variant="h6" mb={2}>
          Informasi Pembeli
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField label="Email Pembeli" variant="outlined" fullWidth />
          <TextField label="Nomor Handphone" variant="outlined" fullWidth />
          <TextField label="Input Alamat" variant="outlined" fullWidth />
          {/* Placeholder for Map */}
          <Box
            height={200}
            bgcolor="#e0e0e0"
            borderRadius={1}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="body2" color="textSecondary">
              Map Placeholder
            </Typography>
          </Box>
          <TextField label="Catatan" variant="outlined" fullWidth multiline rows={3} />
        </Box>
      </Box>

      {/* Right Section */}
      <Box flex={1}>
        {/* Product Details */}
        <Typography variant="h6" mb={2}>
          Detail Produk
        </Typography>
        {dummyData.map((item) => (
          <Card key={item.id} sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">{item.name}</Typography>
                <Typography variant="body1">Harga: Rp. {item.price.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Price Summary */}
        <Typography variant="h6" mt={4} mb={2}>
          Ringkasan Harga
        </Typography>
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Total Harga ({totalItems} Produk):</Typography>
              <Typography variant="body2">Rp. {totalPrice.toLocaleString()}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Ongkos Kirim:</Typography>
              <Typography variant="body2">Rp. {shippingCost.toLocaleString()}</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1" fontWeight="bold">
                Total Tagihan:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                Rp. {(totalPrice + shippingCost).toLocaleString()}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Checkout Button */}
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3, py: 1.5 }}
        >
          Lanjut Pembayaran
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
