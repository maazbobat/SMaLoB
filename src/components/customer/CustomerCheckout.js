import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import { toast } from "react-toastify";
import Navbar from "./CustomerNavbar";
import Footer from "../Footer";
import "../../styles/checkout.css";

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
      toast.error("Failed to load cart.");
    }
  };

  const loadSquareSDK = () => {
    if (document.getElementById("square-sdk")) {
      waitForSquare();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://sandbox.web.squarecdn.com/v1/square.js";
    script.id = "square-sdk";
    script.async = true;
    script.onload = waitForSquare;
    script.onerror = () => toast.error("❌ Failed to load Square SDK");
    document.body.appendChild(script);
  };

  const waitForSquare = () => {
    let tries = 0;
    const interval = setInterval(() => {
      if (window.Square) {
        clearInterval(interval);
        initializeSquare();
      } else if (++tries > 10) {
        clearInterval(interval);
        toast.error("⚠️ Payment initialization timeout.");
      }
    }, 300);
  };

  const initializeSquare = async () => {
    try {
      document.getElementById("card-container").innerHTML = "";
      document.getElementById("google-pay")?.replaceChildren();
      document.getElementById("apple-pay")?.replaceChildren();

      const paymentsInstance = window.Square.payments(SQUARE_APP_ID, SQUARE_LOCATION_ID);
      setPayments(paymentsInstance);

      // Card Payment
      const cardInstance = await paymentsInstance.card();
      await cardInstance.attach("#card-container");
      setCard(cardInstance);

      // Google Pay
      const gPay = await paymentsInstance.googlePay({ redirectURL: window.location.origin });
const gPaySupported = await gPay?.isSupported();
console.log("🟢 Google Pay supported:", gPaySupported);

if (gPaySupported) await gPay.attach("#google-pay");

const applePay = await paymentsInstance.applePay({ redirectURL: window.location.origin });
const appleSupported = await applePay?.isSupported();
console.log("🍏 Apple Pay supported:", appleSupported);

if (appleSupported) await applePay.attach("#apple-pay");

    } catch (error) {
      console.error("❌ Square init error:", error);
    }
  };

  const handlePayment = async () => {
    try {
      if (!card) {
        toast.error("❌ Payment method not ready.");
        return;
      }

      const result = await card.tokenize();
      if (result.status !== "OK") throw new Error("Tokenization failed");

      const response = await api.post("/checkout", {
        sourceId: result.token,
        amount,
        customerInfo,
      });

      if (response.data.success) {
        toast.success("✅ Payment successful!");
      
        // Clear local cart state
        setCart({ items: [], total: 0 });
      
        // Navigate to dashboard (or orders page)
        navigate("/customer/dashboard");
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
      <div className="checkout-wrapper container">
        <h2 className="checkout-heading">Secure Checkout</h2>
        <p className="checkout-subheading">
          You're paying <strong>${amount}</strong> CAD (Incl. 13% HST)
        </p>

        {/* Shipping Info */}
        <div className="form-section">
          <h4 className="form-title">Shipping Information</h4>
          <div className="form-grid">
            <input placeholder="Full Name" value={customerInfo.name} onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })} />
            <input placeholder="Email" type="email" value={customerInfo.email} onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })} />
            <input placeholder="Phone" value={customerInfo.phone} onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })} />
            <input placeholder="Address" value={customerInfo.address} onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })} />
            <input placeholder="Postal Code" value={customerInfo.postalCode} onChange={(e) => setCustomerInfo({ ...customerInfo, postalCode: e.target.value })} />
          </div>
        </div>

        {/* Payment Methods */}
        <div className="form-section">
          <h4 className="form-title">Payment Methods</h4>
          <div className="wallet-options">
            <div id="google-pay" className="wallet-button" />
            <div id="apple-pay" className="wallet-button" />
          </div>
          <div id="card-container" className="card-form" />
          <button className="btn checkout-btn mt-3" onClick={handlePayment}>
            Pay ${amount}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CustomerCheckout;