"use client";
import React, { useState, useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { Box, TextField, Typography, Card, CardContent, Button, Divider } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-control-geocoder";
import * as EsriLeaflet from 'esri-leaflet';
import 'esri-leaflet-geocoder';

import dynamic from "next/dynamic";

const geocodeService = EsriLeaflet.Geocoding;  // Initialize geocodeService from EsriLeaflet
// Dynamically import Leaflet with no SSR (server-side rendering)
const MapContainerWithNoSSR = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false, // Disable SSR for this component
});

const TileLayerWithNoSSR = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
});

// Prevent default icon URL errors in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CheckoutPage = () => {
  const dummyData = [
    { id: 1, name: "Print Kertas HVS (1 Lembar)", price: 10000 },
    { id: 2, name: "Print Kertas Folio (1 Lembar)", price: 10000 },
    { id: 3, name: "Print Kertas Folio Berwarna (1 Lembar)", price: 10000 },
  ];

  const totalItems = dummyData.length;
  const totalPrice = dummyData.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = 12000;

  const [position, setPosition] = useState([-6.2088, 106.8456]); // Default Jakarta coordinates
  const [address, setAddress] = useState(null);
  const mapRef = useRef();

  // LocationSearch component for handling search and reverse geocoding
  const LocationSearch = () => {
    const map = useMap();

    useEffect(() => {
      console.log(geocodeService); // Check if geocodeService is defined

      // Adding geocoder control to map
      const geocoderControl = L.Control.geocoder({
        defaultMarkGeocode: false,
      }).on("markgeocode", function (e) {
        const latlng = e.geocode.center;
        map.setView(latlng, 13);
        setPosition([latlng.lat, latlng.lng]);

        // Reverse geocoding to get address from coordinates
        if (geocodeService) {  // Ensure geocodeService is defined before calling reverse
          geocodeService.reverse(latlng, 13, (error, result) => {
            if (error) {
              console.error(error);
              return;
            }
            setAddress(result.address.Match_addr);  // Store address from reverse geocode result
          });
        } else {
          console.error("Geocode service is not available.");
        }
      });

      // Add geocoder control to map if it's not already added
      const existingControls = document.querySelectorAll(".leaflet-control-geocoder");
      if (existingControls.length === 0) {
        geocoderControl.addTo(map);
      }

      return () => {
        map.removeControl(geocoderControl);
      };
    }, [map]);

    return null;
  };

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
          
          {/* Map with location search and reverse geocoding */}
          <Box height={300} borderRadius={1} overflow="hidden">
            <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }} whenCreated={(map) => (mapRef.current = map)}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>Posisi Terpilih</Popup>
              </Marker>
              <LocationSearch />
            </MapContainer>
          </Box>

          {/* Display address found by reverse geocoding */}
          <Box mt={2}>
            <Typography variant="h6">Alamat Lokasi:</Typography>
            <Box border={1} p={2} borderRadius={1}>
              <Typography variant="body2">{address || "Alamat tidak ditemukan"}</Typography>
            </Box>
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
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 3, py: 1.5 }}>
          Lanjut Pembayaran
        </Button>
      </Box>
    </Box>
  );
};

export default CheckoutPage;
