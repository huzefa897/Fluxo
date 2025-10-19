import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import ListProducts from './components/ListProducts';
import productCard from './components/productCard.jsx';
import ChangeStock from './components/ChangeStock';
import AddProduct from './components/AddProduct';
const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/productCard/:id',
        element: <productCard />,
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
