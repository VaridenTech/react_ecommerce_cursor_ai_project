import { createBrowserRouter, type RouteObject } from 'react-router'
import MainLayout from '@/app/layouts/MainLayout/MainLayout'
import RouteErrorFallback from '@/app/RouteErrorFallback'
import Cart from '@/pages/Cart/Cart'
import Category from '@/pages/Category/Category'
import Checkout from '@/pages/Checkout/Checkout'
import Home from '@/pages/Home/Home'
import OrderSuccess from '@/pages/Order/OrderSuccess'
import Product from '@/pages/Product/Product'

export const routes: RouteObject[] = [
  {
    element: <MainLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categories', element: <Category /> },
      { path: '/products/:id', element: <Product /> },
      { path: '/cart', element: <Cart /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/order/success', element: <OrderSuccess /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
