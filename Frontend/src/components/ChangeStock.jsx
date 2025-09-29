import React from 'react'
import { useState,useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { addStock, removeStock } from '../services/productsServices'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Banner from './banner';
import Header from './Header';

const ChangingStock = () => {
    const [quantity, setQuantity] = useState(0)
    const [SKU, setSKU] = useState("")
    const [product, setProduct] = useState({})
    const [banner, setBanner] = useState(false);
    const [bannerMessage, setBannerMessage] = useState("");
    const [bannerType, setBannerType] = useState("success");
    const goBack = ()=>{
        window.history.back();
    }
    const handleChangeStock = () => {
        addStock(SKU,quantity)
        .then((response)=>{
            setProduct(response.data)
            setBanner(true);
            setBannerMessage("Stock Added Successfully");
            setBannerType("success");
            setTimeout(() => {
                setBanner(false);
            }, 3000);
        })
        .catch((error)=>{
            console.error(error)
            setBanner(true);
            setBannerMessage("Stock Addition Failed");
            setBannerType("error");
            setTimeout(() => {
                setBanner(false);
            }, 3000);
        })
    }
    const handleChangeStockRemove = () => {
        removeStock(SKU,quantity)
        .then((response)=>{
            setProduct(response.data)
            setBannerMessage("Stock Removed Successfully");
            setBannerType("success");
            setBanner(true);
            setTimeout(() => {
                setBanner(false);
            }, 3000);
        })
        .catch((error)=>{
            console.error(error)
            setBanner(true);
            setBannerMessage("Stock Removal Failed");
            setBannerType("error");
            setTimeout(() => {
                setBanner(false);
            }, 3000);
        })
    }
  return (
    <>
    <Header/>
{banner && <Banner message={bannerMessage} type={bannerType} />}
  <h2 className="text-2xl font-semibold mb-4 text-center pt-10">Change Stock</h2>
  <div className="absolute top-[100px] left-10">
    <Button onClick={goBack} className='btn btn-primary mt-2 bg-gray-200 px-4 py-2 rounded'>Back</Button>
  </div>
  <div className="max-w-md mx-auto">
    <div className="bg-white p-6 rounded-2xl shadow flex flex-col gap-5">
      <TextField
        fullWidth
        label="Enter the ID / Barcode"
        variant="outlined"
        value={SKU}
        onChange={(e) => setSKU(e.target.value)}
      />

      <TextField
        fullWidth
        type="number"
        label="Enter the quantity"
        variant="outlined"
        value={quantity}
        onChange={(e) => {
            let val = Number(e.target.value);
            if (e.target.value === "") {
              setQuantity("");
              return;
            }
            if (val < 1) val = 1;
            if (val > 100) val = 100;
            setQuantity(val);
          }}
      />

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="contained"
          onClick={handleChangeStock}
          fullWidth
        >
          Add Stock
        </Button>

        <Button
          variant="outlined"
          color="error"
          onClick={handleChangeStockRemove}
          fullWidth
        >
          Remove
        </Button>
      </div>
    </div>
  </div>
</>

  )
}
export default ChangingStock