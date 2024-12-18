"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Box, Typography, Divider, List, ListItem, ListItemText } from "@mui/material";

const OrderDetailPage = () => {
  const { id } = useParams(); // Get the idTransaksi from the URL
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/transaction/online/customer");
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        // Find the order matching idTransaksi
        const foundOrder = data.data.orders.find(
          (order) => String(order.idTransaksi) === String(id)
        );
        setOrder(foundOrder);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, [id]);

  if (!order) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ padding: "20px", backgroundColor: "#f4e4d8", minHeight: "100vh" }}>
      <Typography variant="h4" mb={3}>{`Order Detail - ${order.idTransaksi}`}</Typography>

      <Typography variant="h6" gutterBottom>General Information</Typography>
      <Typography variant="body1">{`Order ID: ${order.idTransaksi}`}</Typography>
      <Typography variant="body1">{`User ID: ${order.userId}`}</Typography>
      <Typography variant="body1">{`Address: ${order.alamat}`}</Typography>
      <Typography variant="body1">{`Status: ${order.status}`}</Typography>
      <Typography variant="body1">{`Notes: ${order.notes || "No notes provided"}`}</Typography>
      <Typography variant="body1">{`Delivery Fee: Rp.${order.ongkir}`}</Typography>
      <Typography variant="body1">{`Total: Rp.${order.total}`}</Typography>
      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="h6" gutterBottom>Jasa</Typography>
      <List>
        {order.jasa.map((jasa, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${jasa.nama}`}
              secondary={`Price: Rp.${jasa.harga} | Quantity: ${jasa.qty} | Subtotal: Rp.${jasa.harga * jasa.qty}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="h6" gutterBottom>Add-Ons</Typography>
      <List>
        {order.addOns.map((addOn, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${addOn.nama}`}
              secondary={`Price: Rp.${addOn.harga} | Quantity: ${addOn.qty} | Subtotal: Rp.${addOn.subtotal}`}
            />
          </ListItem>
        ))}
      </List>
      <Divider sx={{ margin: "20px 0" }} />

      <Typography variant="body2" color="textSecondary">{`Created At: ${new Date(order.createdAt).toLocaleString()}`}</Typography>
      <Typography variant="body2" color="textSecondary">{`Updated At: ${new Date(order.updatedAt).toLocaleString()}`}</Typography>
    </Box>
  );
};

export default OrderDetailPage;
