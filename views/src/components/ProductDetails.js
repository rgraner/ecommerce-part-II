import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${productId}`);
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
  }, [productId]);

  const handleAddToCart = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    console.log(isLoggedIn)
    if (isLoggedIn === "false") {
      // Redirect to login page with current location as state
      navigate('/login', { state: { from: location } });
      return;
    }

    try {
      const response = await fetch('/api/auth/check');
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const user = await response.json();
      console.log('user: ', user)
      const userId = user.id;

      const response2 = await fetch(`/api/cart/user/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      if (!response2.ok) {
        throw new Error(response2.statusText);
      }

      // Redirect to product details page with added product in cart
      navigate(`/products/${productId}`, { state: { addedToCart: true } });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {product ? (
        <>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          {/* <img src={`/${product.image}`} alt={product.name} /> */} {/* if product images are stored in the public folder. */}
          <img src={window.atob(product.image)} alt={product.name} />
          {localStorage.getItem("isLoggedIn") ? (
            <button onClick={handleAddToCart}>Add to Cart</button>
          ) : (
            <p>Please log in to add this product to your cart.</p>
          )}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;