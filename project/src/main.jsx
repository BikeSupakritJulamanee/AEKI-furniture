import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// add bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';

// add context
import { UserAuthContextProvider } from './context/UserAuthContext.jsx'

// add ProtectedRoute for protect home page
import ProtectedRoute from './auth/ProtectedRoute.jsx';

// add react-router-dom
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

// add router
import Register from './component/Register.jsx'
import Login from './component/Login.jsx'
import Home from './component/Home.jsx'
//User
import Product_detail from './component/Product_detail.jsx';
import UserorderList from './component/UserorderList.jsx';
import OrderHistory from './component/OrderHistory.jsx';

import AdminHomePage from './administrator/AdminHomePage.jsx'
import Add_Products from './administrator/Add_Products.jsx';
import Edit_Products from './administrator/Edit_Products.jsx'
import Product_List from './administrator/Product_List.jsx';
import Transportation from './administrator/Transportation.jsx';
import Order_List from './administrator/Order_List.jsx';
import ViewOrder from './administrator/ViewOrder.jsx';
import OutOfStock from './administrator/OutOfStock.jsx';
import Member_List from './administrator/Member_List.jsx';

import Tmp from './component/Tmp.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/home',
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: '/product_detail',
    element: <ProtectedRoute><Product_detail /></ProtectedRoute>
  },
  {
    path: '/userorderlist',
    element: <ProtectedRoute><UserorderList /></ProtectedRoute>
  },
  {
    path: '/order_history',
    element: <ProtectedRoute><OrderHistory /></ProtectedRoute>
  },

  {
    path: '/adminhomepage',
    element: <AdminHomePage />
  },
  {
    path: '/add_products',
    element: <Add_Products />
  },
  {
    path: '/edit_products',
    element: <Edit_Products />
  },
  {
    path: '/product_list',
    element: <Product_List />
  },
  {
    path: '/transportation',
    element: <Transportation />
  },
  {
    path: '/order_list',
    element: <Order_List />
  },
  {
    path: '/view_order',
    element: <ViewOrder />
  },
  {
    path: '/out_of_stock',
    element: <OutOfStock />
  },
  {
    path: '/member_list',
    element: <Member_List/>
  },

{
  path: '/tmp',
    element: <Tmp />
}

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserAuthContextProvider>
      <RouterProvider router={router} />
    </UserAuthContextProvider>
  </React.StrictMode>,
)
