import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import ListProducts from './components/ListProducts';
import ProductCard from './components/productCard';
import ChangeStock from './components/ChangeStock';
import AddProduct from './components/AddProduct';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/productCard/:id',
        element: <ProductCard />,
    },
    {
      path: '/changeStock',
      element: <ChangeStock />,
  },
  {
    path: '/addProduct',
    element: <AddProduct />,
},
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
