import React, { useState } from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { newProduct } from '../services/productsServices';
import Banner from './banner';

const AddProduct = () => {
  const defaultProduct = {
    sku: "",
    name: "",
    description: "",
    brand: "",
    category: "",
    quantity: 0, 
  };
  const [hidden, setHidden] = useState(false);
  const [banner, setBanner] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [bannerType, setBannerType] = useState("success");

  const [product, setProduct] = useState(defaultProduct);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((p) => ({
      ...p,
      [name]: name === "quantity" ? Number(value || 0) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...product,
      lastAddDate: new Date().toISOString().split("T")[0],
    };

    console.log("SUBMIT payload ->", JSON.stringify(payload, null, 2));

    try {
      const res = await newProduct(payload);
      console.log("✅ Product added:", res.data);
      setProduct(defaultProduct); 
      setBanner(true);
      setBannerMessage("Product added successfully");
      setBannerType("success");
      setTimeout(() => {
        setBanner(false);
      }, 3000);
    } catch (err) {
      console.error("❌ Error adding product:", err);
      setBanner(true);
      setBannerMessage("Product addition failed");
      setBannerType("error");
      setTimeout(() => {
        setBanner(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header/>
      {banner && <Banner message={bannerMessage} type={bannerType} />}
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 max-w-md mx-auto pt-10'>
        <label>Product Id/Barcode</label>
        <TextField
          name="sku"
          label="Id/Barcode"
          variant="outlined"
          size="small"
          value={product.sku}
          onChange={handleChange}
        />

        <label>Product Name</label>
        <TextField
          name="name"
          label="Name"
          variant="outlined"
          size="small"
          value={product.name}
          onChange={handleChange}
        />

        <label>Description</label>
        <TextField
          name="description"
          label="Description"
          variant="outlined"
          size="small"
          value={product.description}
          onChange={handleChange}
        />

        <label>Brand</label>
        <TextField
          name="brand"
          label="Brand"
          variant="outlined"
          size="small"
          value={product.brand}
          onChange={handleChange}
        />

        <label>Category</label>
        <TextField
          name="category"
          label="Category"
          variant="outlined"
          size="small"
          value={product.category}
          onChange={handleChange}
        />

        <label>Quantity</label>
        <TextField
          name="quantity"
          label="Quantity"
          type="number"
          variant="outlined"
          size="small"
          value={product.quantity}
          onChange={handleChange}
        />
        <Button hidden={hidden}
  onClick={() =>
    setProduct({
      sku: "DEV"+Math.floor(Math.random() * 1000000),
      name: "Test Product",
      description: "This is just a test",
      brand: "Test Brand",
      category: "Testing",
      quantity: "10",
    })
  }
>
  Prefill Test Data
</Button>

        <Button type="submit" disabled={product.sku === "" || product.name === "" || product.description === "" || product.brand === "" || product.category === "" || product.quantity === ""} variant="contained" className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
          Add Product
        </Button>
      </form>
    </>
  );
};

export default AddProduct;
