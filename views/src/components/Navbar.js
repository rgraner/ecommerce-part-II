import React from 'react';
import { Link } from 'react-router-dom';



function Navbar({ isLoggedIn, userId }) {

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
             <Link to={`/cart/${userId}`}>Cart</Link>
            </li>
            <li>
              <Link to={`/orders/${userId}`}>Orders</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}


export default Navbar;

