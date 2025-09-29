import React, { useEffect, useState } from 'react'
import { getProductById } from '../services/productsServices'
import { useParams } from "react-router-dom"
import Header from './Header'
export default function ProductCard() {
  const [product, setProduct] = useState({})
  const { id } = useParams()

  useEffect(() => {
    getProductById(id)
      .then((response) => {
        setProduct(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [id])

  return (
    <>
    <header><Header/></header>
      <div className="p-6 border rounded-lg shadow-md bg-white text-center">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-700">{product.description}</p>
        <p className="text-gray-700"><strong>Brand:</strong> {product.brand}</p>
        <p className="text-gray-700"><strong>Category:</strong> {product.category}</p>
        <p className="text-gray-700"><strong>Quantity:</strong> {product.quantity}</p>
        <p className="text-gray-700"><strong>Last Added:</strong> {product.lastAddDate}</p>
      </div>

      {/* <div className="flex flex-col mt-6 space-y-4">
        <Add className="p-4 border rounded-lg shadow bg-green-100" />
        <Delete className="p-4 border rounded-lg shadow bg-red-100" />
      </div> */}
    </>
  )
}
