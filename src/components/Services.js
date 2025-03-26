import React from "react";
import Footer from "./Footer";
import Navigation from "./Navbar";
import "../styles/services.css"; // Make sure to create this file

const Services = () => {
  const services = [
    {
      icon: "🛒",
      title: "Vendor Onboarding & Product Management",
      description:
        "SMaLoB provides an easy-to-use portal for vendors to sign up, manage their profiles, upload products, manage stock levels, and run their shop independently with full control.",
    },
    {
      icon: "📦",
      title: "Order Management & Real-Time Tracking",
      description:
        "Vendors and customers can track orders in real-time. Vendors get notified when a new order is placed and can update order statuses like 'Shipped' or 'Delivered' instantly.",
    },
    {
      icon: "💬",
      title: "Customer Communication & Support",
      description:
        "Integrated messaging features including email and SMS via Twilio help vendors and customers communicate effectively. Admins can also send system-wide alerts or updates.",
    },
    {
      icon: "📈",
      title: "Sales & Analytics Dashboard",
      description:
        "Interactive dashboards for vendors and admins show total revenue, top-selling products, inventory stats, and monthly performance trends with visual charts.",
    },
    {
      icon: "🎯",
      title: "Local Search & Smart Recommendations",
      description:
        "Users can discover vendors and products nearby using geolocation filters, tags, and voice search. Recommendations are personalized based on user interests and history.",
    },
    {
      icon: "🔐",
      title: "Secure Authentication & Role Management",
      description:
        "With JWT-based authentication, secure roles (Admin, Vendor, Customer) ensure the right access and data visibility across the platform.",
    },
    {
      icon: "💳",
      title: "Integrated Payments with Square",
      description:
        "SMaLoB integrates Square’s payment gateway for seamless, secure transactions — ensuring vendors get paid fast and customers enjoy a trusted checkout experience.",
    },
  ];

  return (
    <div>
      <Navigation />
      <div className="container py-5">
        <h1 className="mb-5 text-center" style={{ color: "#FF5A4E" }}>
          🚀 What We Offer
        </h1>
        <div className="row g-4">
          {services.map((service, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="service-card h-100 shadow-sm p-4 rounded-4">
                <div className="icon mb-3">{service.icon}</div>
                <h5 className="mb-2" style={{ color: "#FBB040" }}>{service.title}</h5>
                <p className="text-muted">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;