import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
  
    useEffect(() => {
      async function fetchProduct() {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          const product = await response.json();
          setProduct(product);
        } catch (error) {
          console.error(error);
        }
      }
      fetchProduct();
    }, []);


    return (
        <div>
        {product ? (
            <>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            {/* <img src={`/${product.image}`} alt={product.name} /> */} {/* if product images are stored in the public folder. */}
            <img src={window.atob(product.image)} alt={product.name} />
            <button>Add to Cart</button>
            </>
        ) : (
            <p>Loading...</p>
        )}
        </div>
    );
};

export default ProductDetails;

