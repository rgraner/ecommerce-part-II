import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home.js';
import Users from './components/Users.js';
import Products from './components/Products.js';
import ProductDetails from './components/ProductDetails';
// import Orders from './components/Orders';
import Register from './components/Register.js';
import Login from './components/Login.js';
import Navbar from './components/Navbar.js';
import Logout from './components/Logout.js';
import Cart from './components/Cart.js';
import Completion from './components/Completion.js';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    if (storedIsLoggedIn === 'true') {
      setIsLoggedIn(true);
      setUserId(localStorage.getItem('userId'));
    }
  }, []);

  const handleLogin = (loggedInUserId) => {
    setIsLoggedIn(true);
    setUserId(loggedInUserId);
    localStorage.setItem('isLoggedIn', true);
    localStorage.setItem('userId', loggedInUserId);
  };

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userId={userId} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} onLogin={handleLogin} />} />
        <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/cart/:userId" element={<Cart />} />
        <Route path="/completion/:userId" element={<Completion />} />
      </Routes>
    </Router>
  );
}

export default App;
