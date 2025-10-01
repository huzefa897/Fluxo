import React, {useEffect,useState} from 'react'
import { getAllProducts,deleteProduct } from '../services/productsServices';
import {Link} from 'react-router-dom';
import Header from './Header';

export const ListProducts = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    getAllProducts().then((response)=>{

        setProducts(response.data);
    }).catch((error)=>{
        console.log(error);
    })
  }, []);

  const refresh = () => {
    window.location.reload();
  }
  
  return (
    <>
    <Header/>
    <h2 className='text-2xl font-semibold mb-4 text-center pt-10'>List Of Products </h2>
    <div className='flex flex-col mt-6 space-y-4 max-w-7xl mx-auto'>
    {/* <Link to={`/ChangeStock`}>
    <button className='btn btn-primary '>Change Stock</button>
    </Link> */}

    
    <div>
        <table className="table table-striped table-bordered">
        <thead>
            <tr>
                <th>Id</th>
                <th>sku</th>
                <th>Name</th>
                <th>Description</th>
                <th>Brand</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Last Add Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        {
            products.map((product)=>{
                return(
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>{product.sku}</td>
                     <td><Link className='text-decoration-none' to={`/ProductCard/${product.sku}`}>{product.name}</Link></td>
                        <td>{product.description}</td>
                        <td>{product.brand}</td>
                        <td>{product.category}</td>
                        <td>{product.quantity}</td>
                        <td>{product.lastAddDate}</td>
                        <td>
                            <button className="btn btn-danger" onClick={()=>{
                                refresh();
                                deleteProduct(product.sku)}}>Delete</button>
                        </td>
                    </tr>
                )
            })

        }

        </tbody>
        </table>
    </div>
    </div>
    </>
  )
}
export default ListProducts;