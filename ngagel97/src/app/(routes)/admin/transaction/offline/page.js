"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  Checkbox,
} from "@mui/material";

const OfflineTransactionPage = () => {
  const [barangList, setBarangList] = useState([]);
  const [jasaList, setJasaList] = useState([]);
  const [addOnList, setAddOnList] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]); // Filtered add-on list

  const [enableAddOn, setEnableAddOn] = useState(false);

  const [selectedBarang, setSelectedBarang] = useState("");
  const [selectedJasa, setSelectedJasa] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]); // Multiple add-ons

  const [rows, setRows] = useState([]);
  const [qtyBarang, setQtyBarang] = useState(1);
  const [qtyJasa, setQtyJasa] = useState(1);
  const [addOnQuantities, setAddOnQuantities] = useState({}); // Add-on quantities

  const todayDate = new Date().toLocaleDateString("id-ID");

  // Fetch data from APIs
  useEffect(() => {
    fetch("/api/barang")
      .then((res) => res.json())
      .then((data) => setBarangList(data));

    fetch("/api/jasa")
      .then((res) => res.json())
      .then((data) => setJasaList(data));

    fetch("/api/addon")
      .then((res) => res.json())
      .then((data) => setAddOnList(data));
  }, []);

  // Update filteredAddOnList when jasa is selected
  useEffect(() => {
    if (selectedJasa) {
      const selectedJasaData = jasaList.find((jasa) => jasa.nama === selectedJasa);
      if (selectedJasaData && selectedJasaData.addOns) {
        const filteredAddOns = addOnList.filter((addon) =>
          selectedJasaData.addOns.includes(addon._id)
        );
        setFilteredAddOnList(filteredAddOns);
      }
    } else {
      setFilteredAddOnList([]);
    }
  }, [selectedJasa, jasaList, addOnList]);

  // Handle adding a new row to the table
  const handleAdd = () => {
    let newProduct = selectedBarang || selectedJasa;
    let qty = selectedBarang ? qtyBarang : qtyJasa;
    let harga =
      selectedBarang
        ? barangList.find((b) => b.nama === selectedBarang)?.harga
        : jasaList.find((j) => j.nama === selectedJasa)?.harga;

    let addOnDetails = enableAddOn
      ? selectedAddOns.map((addon) => ({
          name: addon,
          qty: addOnQuantities[addon] || 1,
        }))
      : [];

    const addOnPrice = addOnDetails.reduce((sum, addon) => {
      const addonHarga = addOnList.find((a) => a.nama === addon.name)?.harga || 0;
      return sum + addonHarga * addon.qty;
    }, 0);

    const subtotal = harga * qty + addOnPrice;

    const newRow = {
      tanggal: todayDate,
      product: newProduct,
      jumlah: qty,
      harga: `Rp. ${(harga * qty).toLocaleString()}`,
      addOn: addOnDetails.length
        ? addOnDetails.map((a) => `${a.name} (Qty: ${a.qty})`).join("<br />")
        : "-",
      subtotal: `Rp. ${subtotal.toLocaleString()}`,
    };

    setRows([...rows, newRow]);

    // Reset fields
    setSelectedBarang("");
    setSelectedJasa("");
    setSelectedAddOns([]);
    setEnableAddOn(false);
    setQtyBarang(1);
    setQtyJasa(1);
    setAddOnQuantities({});
  };

  // Handle checkbox change for add-ons
  const handleAddOnCheckboxChange = (addonName) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonName)
        ? prev.filter((name) => name !== addonName)
        : [...prev, addonName]
    );
  };

  // Handle delete row from table
  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  // Handle transaction completion
  const handleCompleteTransaction = () => {
    // Placeholder for transaction completion logic
    alert("Transaksi selesai!");
    // You can send the rows data to the backend or perform other actions here
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h5" gutterBottom color="black">
          Pencatatan Transaksi Offline
        </Typography>
        <Typography variant="h6" color="black">
          Tanggal: {todayDate}
        </Typography>
      </Box>

      <Box display="flex" gap={2} mb={4}>
        <Box sx={{ flex: 1 }}>
          <Typography>Pilih Barang</Typography>
          <TextField
            select
            value={selectedBarang}
            onChange={(e) => {
              setSelectedBarang(e.target.value);
              setSelectedJasa("");
              setEnableAddOn(false);
            }}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">-- Pilih Barang --</option>
            {barangList.map((barang) => (
              <option key={barang.idBarang} value={barang.nama}>
                {barang.nama}
              </option>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Qty"
            value={qtyBarang}
            onChange={(e) => setQtyBarang(Number(e.target.value))}
            fullWidth
            sx={{ mt: 1 }}
          />

          <Typography sx={{ mt: 2 }}>Pilih Jasa</Typography>
          <TextField
            select
            value={selectedJasa}
            onChange={(e) => {
              setSelectedJasa(e.target.value);
              setSelectedBarang("");
              setEnableAddOn(true);
            }}
            SelectProps={{ native: true }}
            fullWidth
          >
            <option value="">-- Pilih Jasa --</option>
            {jasaList.map((jasa) => (
              <option key={jasa.idJasa} value={jasa.nama}>
                {jasa.nama}
              </option>
            ))}
          </TextField>
          <TextField
            type="number"
            label="Qty"
            value={qtyJasa}
            onChange={(e) => setQtyJasa(Number(e.target.value))}
            fullWidth
            sx={{ mt: 1 }}
          />

          {enableAddOn && (
            <Box sx={{ mt: 2 }}>
              <Typography>Pilih Add-On</Typography>
              {filteredAddOnList.map((addon) => (
                <Box key={addon._id} display="flex" alignItems="center" gap={1}>
                  <Checkbox
                    checked={selectedAddOns.includes(addon.nama)}
                    onChange={() => handleAddOnCheckboxChange(addon.nama)}
                  />
                  <Typography>{addon.nama}</Typography>
                  <TextField
                    type="number"
                    label="Qty"
                    size="small"
                    value={addOnQuantities[addon.nama] || 1}
                    onChange={(e) =>
                      setAddOnQuantities({
                        ...addOnQuantities,
                        [addon.nama]: Number(e.target.value),
                      })
                    }
                    sx={{ width: 80 }}
                  />
                </Box>
              ))}
            </Box>
          )}

          <Button variant="contained" color="success" onClick={handleAdd} sx={{ mt: 2 }}>
            Tambahkan Transaksi
          </Button>
        </Box>

        {/* Tabel Transaksi */}
        <TableContainer component={Paper} sx={{ flex: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  <strong>Product</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Jumlah</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Harga</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Add-On</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Subtotal</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{row.product}</TableCell>
                  <TableCell align="center">{row.jumlah}</TableCell>
                  <TableCell align="center">{row.harga}</TableCell>
                  <TableCell align="center">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: row.addOn,
                    }}
                  />
                </TableCell>
                  <TableCell align="center">{row.subtotal}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(index)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Button Transaksi di bawah tabel */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleCompleteTransaction}>
          Selesaikan Transaksi
        </Button>
      </Box>
    </Container>
  );
};

export default OfflineTransactionPage;
