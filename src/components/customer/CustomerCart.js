import React, { useEffect, useState } from "react";
import { FiTrash, FiShoppingCart, FiPlus, FiMinus, FiCreditCard } from "react-icons/fi";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import api from "../../api/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/cart.css";
import { useNavigate, Link } from "react-router-dom";

const CustomerCart = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await api.get("/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCart(response.data || { items: [], total: 0 });
    } catch (error) {
      console.error("❌ Error fetching cart:", error);
      toast.error("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const response = await api.put(
        `/cart/update/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCart(response.data); // or refetchCart()
      toast.success("Cart updated!");
    } catch (error) {
      console.error("❌ Error updating cart:", error);
      toast.error("Failed to update cart.");
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await api.delete(`/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter((item) => item.product._id !== productId),
      }));
      toast.success("Removed from cart!");
    } catch (error) {
      console.error("❌ Error removing from cart:", error);
      toast.error("Failed to remove item.");
    }
  };

  const navigate = useNavigate();

  const calculateTotals = () => {
    const subtotal = cart.items.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const hst = subtotal * 0.13;
    const total = subtotal + hst;
    return { subtotal, hst, total };
  };

  const { subtotal, hst, total } = calculateTotals();

  if (loading) return <p className="loading-text">Loading your cart...</p>;

  return (
    <div className="cart-page">
      <Navbar />
      <div className="cart-container">
        <h1>Shopping Cart <FiShoppingCart className="cart-icon" /></h1>

        {cart.items.length > 0 ? (
          <div className="cart-grid">
            {cart.items.map(({ product, quantity }) => (
              product && (
                <div key={product._id} className="cart-card">
                  <Link to={`/product/${product._id}`}>
                                    <img src={`http://localhost:3001${product.images?.[0]}`} alt={product.name} onError={(e) => e.target.src = "/default-product.jpg"} />
                                    </Link>
                  <div className="cart-details">
                    <h4>{product.name}</h4>
                    <p>${product.price}</p>
                    <div className="quantity-controls">
                      <button onClick={() => updateQuantity(product._id, quantity - 1)} disabled={quantity <= 1}>
                        <FiMinus />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => updateQuantity(product._id, quantity + 1)}>
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => handleRemoveFromCart(product._id)}>
                    <FiTrash /> Remove
                  </button>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="no-data">Your cart is empty. Start shopping now!</p>
        )}

        {cart.items.length > 0 && (
          <div className="cart-summary">
            <h3>Subtotal: <span>${subtotal.toFixed(2)}</span></h3>
            <h4>HST (13%): <span>${hst.toFixed(2)}</span></h4>
            <h2>Total: <span>${total.toFixed(2)}</span></h2>
            <button onClick={() => navigate("/checkout")}>Go to Checkout</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CustomerCart;
