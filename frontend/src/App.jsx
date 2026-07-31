import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CataloguePage from './pages/CataloguePage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import AdminPage from './pages/AdminPage';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <ToastProvider>
    <CartProvider>
    <BrowserRouter>
    <Layout>
      <Routes>
        {/* La nouvelle page d'accueil par défaut sur l'URL / */}
        <Route path="/" element={<HomePage />} />

        {/* Les autres pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CataloguePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </Layout>
    </BrowserRouter>
    </CartProvider>
    </ToastProvider>
  );
}

export default App;