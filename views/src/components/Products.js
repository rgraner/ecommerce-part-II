import React, { useState, useEffect } from 'react';
import Navbar from './Navbar.js';

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const products = await response.json();
        setProducts(products);
      } catch (error) {
        console.error(error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            {product.name} - £{product.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Products;