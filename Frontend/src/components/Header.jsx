import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
const Header = () => {
  return (
    <div className='flex justify-center w-full align-center pt-3  bg-[#D1D3D4]'>
      <ul className='flex flex-row gap-30'>
    <div className='pt-2 flex flex-row gap-30'><li><Link to="/" className='text-decoration-none'>Home</Link></li>
    <li><Link to="/products" className='text-decoration-none'>Products</Link></li>
    <li><Link to="/ChangeStock" className='text-decoration-none'>Change Stock</Link></li>
    <li><Link to="/AddProduct" className='text-decoration-none'>Add Product</Link></li>
    </div>
    <li>
        <Box
      component="form"
      sx={{ '& > :not(style)': { m: 0, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
     <div className= ' '> <TextField className="w-100"id="outlined-basic" label="Search Products" variant="outlined" size="small" /></div>
    </Box>
    </li>
    </ul>
    </div>
  )
}  

export default Header