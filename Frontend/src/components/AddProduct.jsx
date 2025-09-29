import React, { useState } from 'react'
import Header from './Header'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { newProduct } from '../services/productsServices';
const AddProduct = () => {
    const defaultProduct = {
        id: '',
        name: '',
        description: '',
        brand: '',
        category: '',
        quantity: '',
        // lastAddDate: new Date().toISOString()
    }
    const [product, setProduct] = useState(defaultProduct)
    const handleChange = (e) => {
        console.log("value"+e.target.value);
        console.log("name"+e.target.name);
        const { name, value } = e.target;
      
        setProduct({
          ...product,
          [name]: name === "quantity" ? Number(value) : value
        });
      };
   const handleSubmit = (e) => {
  e.preventDefault();

  const payload = {
    ...product,
    lastAddDate: new Date().toISOString().split("T")[0]
  };

  newProduct(payload)
    .then((response) => {
      console.log("✅ Product added:", response.data);
      setProduct(defaultProduct); // reset form
    })
    .catch((error) => {
      console.error("❌ Error adding product:", error);
    });
};

  
    return (
    <>
    <Header/>

    <div className='flex flex-col gap-3 max-w-md mx-auto pt-10'>

       <p1>Product Id/Barcode</p1> <TextField onChange={handleChange} name="id" id="outlined-basic" label="Id/Barcode" variant="outlined" size="small" />
       <p1>Product Name</p1> <TextField onChange={handleChange} name="name" id="outlined-basic" label="Name" variant="outlined" size="small" />
       <p1>Description</p1> <TextField onChange={handleChange} name="description" id="outlined-basic" label="Description" variant="outlined" size="small" />
       <p1>Brand</p1> <TextField onChange={handleChange} name="brand" id="outlined-basic" label="Brand" variant="outlined" size="small" />
       <p1>Category</p1> <TextField onChange={handleChange} name="category" id="outlined-basic" label="Category" variant="outlined" size="small" />
       <p1>Quantity</p1> <TextField onChange={handleChange} name="quantity" id="outlined-basic" label="Quantity" variant="outlined" size="small" />
       {/* <p1>Last Added Date</p1> <TextField id="outlined-basic" label="Last Added Date" variant="outlined" size="small" /> */}
       <Button variant="contained" onClick={handleSubmit}className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>Add Product</Button>
    </div>
    </>
  )
}

export default AddProduct