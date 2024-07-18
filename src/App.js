import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import CategoryProductList from './components/CategoryProductList';
import Register from './components/register';
import Login from './components/Login';
import Cart from './components/Cart';
import OrderConfirmation from './components/OrderConfirmation';
import { CartProvider } from './components/CartContext';
import SearchResults from './components/SearchResults';
import Profile from './components/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <CartProvider>
      <Router>
        <Layout currentUser={currentUser} onLogout={handleLogout}>
          <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} />
          <Routes>
            <Route path="/" element={<ProductList currentUser={currentUser} />} />
            <Route path="/product/new" element={currentUser && currentUser.role === 'admin' ? <ProductForm /> : <ProductList currentUser={currentUser} />} />
            <Route path="/products" element={<ProductList currentUser={currentUser} />} />
            <Route path="/category/:id" element={<CategoryProductList currentUser={currentUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/profile" element={<Profile currentUser={currentUser} />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;