import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Users from './components/Users.js';
import Products from './components/Products';
// import Orders from './components/Orders';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/products" element={<Products />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
      </Routes>
    </Router>
  );
}

export default App;