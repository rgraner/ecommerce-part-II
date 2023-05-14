import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

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
      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.map(product => (
            <div key={product.id}>
              <h2><Link to={`/products/${product.id}`}>{product.name}</Link></h2>
              <p>{product.description}</p>
              <img src={window.atob(product.image)} alt={product.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;