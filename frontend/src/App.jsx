import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CataloguePage from './pages/CataloguePage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <BrowserRouter>
    <Layout>
      <Routes>
        {/* La nouvelle page d'accueil par défaut sur l'URL / */}
        <Route path="/" element={<HomePage />} />
        
        {/* Les autres pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/catalog" element={<CataloguePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Layout>
    </BrowserRouter>
  );
}

export default App;