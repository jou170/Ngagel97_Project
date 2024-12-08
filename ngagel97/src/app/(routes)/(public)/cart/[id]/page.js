"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Alert,
  TextField,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import * as pdfjsLib from "pdfjs-dist";

const CartDetail = () => {
  const { id } = useParams(); // id = index cart
  const [cartItem, setCartItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [notes, setNotes] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [filteredAddOnList, setFilteredAddOnList] = useState([]);
  const [service, setService] = useState(null);
  const [addOnList, setAddOnList] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);

  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  // Fetch Cart Data
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartRes = await fetch(`/api/cart/${id}`);
        if (!cartRes.ok) throw new Error("Failed to fetch cart details");
        const cartData = await cartRes.json();
  
        if (cartData.success) {
          const cartItemData = cartData.data; // Cart data
          setCartItem(cartItemData);
          setQuantity(cartItemData.qty || 1);
          setUploadedFile(cartItemData.file || null);
          setPageCount(cartItemData.lembar/ quantity || null);
          setNotes(cartItemData.notes || "");
          
          // Pre-set selected add-ons based on cart data
          setSelectedAddOns(cartItemData.addOns || []);
  
          // After fetching cart data, get the service using idJasa from cart
          fetchServiceData(cartItemData.jasaId);
        } else {
          throw new Error(cartData.message || "Cart item not found");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCartData();
  }, [id]);
  

  const fetchServiceData = async (idJasa) => {
    try {
      const response = await fetch(`/api/jasa/${idJasa}`);
      if (!response.ok) throw new Error("Failed to fetch service details");
      const data = await response.json();
      setService(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Fetch Add-on List
  useEffect(() => {
    const fetchAddOns = async () => {
      try {
        const res = await fetch("/api/addon");
        if (!res.ok) throw new Error("Failed to fetch add-ons");
        const data = await res.json();
        setAddOnList(data);
      } catch (err) {
        setError("Error fetching add-ons: " + err.message);
      }
    };

    fetchAddOns();
  }, []);

  // Memoize filtered add-ons to avoid reprocessing on every render
  const memoizedFilteredAddOns = useMemo(() => {
    if (service && service.addOns) {
      return addOnList.filter((addon) => service.addOns.includes(addon._id));
    }
    return [];
  }, [service, addOnList]);

  useEffect(() => {
    setFilteredAddOnList(memoizedFilteredAddOns);
  }, [memoizedFilteredAddOns]);

  useEffect(() => {
    validateForm();
  }, [uploadedFile, quantity, selectedAddOns]);

  const validateForm = () => {
    const isValid = uploadedFile !== null && quantity > 0;
    setIsFormValid(isValid);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);

      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        try {
          const typedArray = new Uint8Array(e.target.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          setPageCount(pdf.numPages);
        } catch (err) {
          setError("Failed to read the PDF file.");
        }
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  const toggleAddOn = (addon) => {
    setSelectedAddOns((prev) => {
      // Check if the add-on is already selected
      const isAlreadySelected = prev.some((a) => a.addOnId === addon._id);
      
      if (isAlreadySelected) {
        // If selected, remove from selectedAddOns
        return prev.filter((a) => a.addOnId !== addon._id);
      } else {
        // If not selected, add to selectedAddOns
        return [...prev, { addOnId: addon._id, nama: addon.nama, harga: addon.harga }];
      }
    });
  };
  

  const handleUpdateCart = async () => {
    let faon = filteredAddOnList.filter((item) => selectedAddOns.find((it) => it.addOnId == item._id));
    let subAddOn = 0;
    console.log(selectedAddOns);
    
    for(const aon of faon){
      console.log(aon);
      
      if(aon.tipeHarga == "lembar"){
        subAddOn += aon.harga * pageCount * quantity;
      }
      else{
        subAddOn += aon.harga * quantity;
      }
    } 
    let addons = faon.map((i) => {
        return {
          addOnId: i._id,
          nama: i.nama,
          harga: i.harga,
          qty: i.tipeHarga == "lembar" ? quantity * pageCount : quantity,
          tipeHarga: i.tipeHarga,
          subtotal: i.tipeHarga == "lembar" ? i.harga * quantity * pageCount : i.harga * quantity,
        }
      });
      console.log(addons);
      
    const updatedCartData = {
      qty: quantity,
      lembar: pageCount * quantity,
      file: uploadedFile ? uploadedFile.name : cartItem.file,
      notes: notes,
      addOns: addons,
      subtotal: Number.parseInt(cartItem.harga) * pageCount * quantity + subAddOn
    };

    const res = await fetch(`/api/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCartData),
    });

    if (res.ok) {
      alert("Cart updated successfully!");
    } else {
      alert("Failed to update cart.");
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!cartItem) return <Typography>No data available</Typography>;

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              image={cartItem.gambar || "/default-image.png"}
              alt={cartItem.nama}
              sx={{ height: 400, objectFit: "contain" }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CardContent>
              <Typography variant="h4">{cartItem.nama}</Typography>
              <Typography gutterBottom>Price: Rp. {cartItem.harga}</Typography>

              <TextField
                label="Quantity"
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                fullWidth
                sx={{ marginBottom: 2 }}
              />

              <Typography>Upload File:</Typography>
              <TextField
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
                fullWidth
                sx={{ marginBottom: 2 }}
              />
              {uploadedFile && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  Pages: {pageCount || cartItem.lembar}
                </Typography>
              )}

              {filteredAddOnList.map((addon) => (
                <FormControlLabel
                  key={addon._id}
                  control={
                    <Checkbox
                      onChange={() => toggleAddOn(addon)}
                      checked={selectedAddOns.some((a) => a.addOnId === addon._id)}
                    />
                  }
                  label={`${addon.nama} - Rp. ${addon.harga}`}
                />
              ))}

              <TextField
                label="Notes"
                multiline
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                fullWidth
                sx={{ marginTop: 2 }}
              />

              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateCart}
                sx={{ marginTop: 2 }}
              >
                Update Cart
              </Button>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default CartDetail;
