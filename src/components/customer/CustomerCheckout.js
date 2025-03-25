import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";

const SQUARE_APP_ID = "sandbox-sq0idb-57A0so88iPSgv1dot8AyBA";
const SQUARE_LOCATION_ID = "L6B0TST922QYP";

const CustomerCheckout = () => {
  const [payments, setPayments] = useState(null);
  const [card, setCard] = useState(null);
  const [amount, setAmount] = useState(0);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
  });

  const navigate = useNavigate();
  const isMounted = useRef(false);

  useEffect(() => {
    fetchCart();
    if (!isMounted.current) {
      loadSquareSDK();
      isMounted.current = true;
    }
  }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const subtotal = res.data.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      const hst = subtotal * 0.13;
      const total = subtotal + hst;
      setAmount(total.toFixed(2));
      setCart(res.data);
    } catch (error) {
      console.error("❌ Error loading cart:", error);
    }
  };

  const loadSquareSDK = () => {
    const existingScript = document.getElementById("square-sdk");

    if (existingScript) {
      waitForSquare();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.id = "square-sdk";
    script.async = true;
    script.onload = () => waitForSquare();
    script.onerror = () => toast.error("❌ Failed to load Square SDK");
    document.body.appendChild(script);
  };

  const waitForSquare = () => {
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.Square) {
        clearInterval(interval);
        initializeSquare();
      } else if (++attempts > 15) {
        clearInterval(interval);
        toast.error("⚠️ Payment initialization timeout.");
      }
    }, 300);
  };

  const initializeSquare = async () => {
    try {
      const container = document.getElementById("card-container");
      if (container) container.innerHTML = "";

      const paymentsInstance = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      const cardInstance = await paymentsInstance.card();
      await cardInstance.attach("#card-container");

      setPayments(paymentsInstance);
      setCard(cardInstance);
    } catch (error) {
      console.error("❌ Square init error:", error);
    }
  };
  

  const handlePayment = async () => {
    try {
      if (!card) {
        toast.error("Card not ready.");
        return;
      }
  
      const formData = {
        fullName: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        postalCode: customerInfo.postalCode,
        address: customerInfo.address,
      };
  
      const result = await card.tokenize();
console.log("💳 Tokenize result:", result);

if (result.status !== "OK") {
  throw new Error("Tokenization failed");
}

const response = await api.post("/checkout", {
    sourceId: result.token,
    amount,
    customerInfo: formData,
  });
  
      if (response.data.success) {
        toast.success("✅ Payment successful!");
        navigate("/customer/orders");
      } else {
        throw new Error(response.data.message || "Payment failed.");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      toast.error(err.message || "Checkout failed.");
    }
  };

  return (
    <div className="checkout-page">
      <Navbar />
      <div className="checkout-container">
        <h1>Checkout</h1>
        <p>You're paying <strong>${amount}</strong> CAD (incl. 13% HST)</p>

        <div className="customer-info-form">
          <input placeholder="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
          <input placeholder="Email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
          <input placeholder="Phone" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
          <input placeholder="Address" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} />
          <input placeholder="Postal Code" value={customerInfo.postalCode} onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })} />
        </div>

        <div id="card-container" className="card-form" />
        <button className="checkout-btn" onClick={handlePayment}>
          Pay ${amount}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerCheckout;