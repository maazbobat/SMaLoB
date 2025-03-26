import React, { useState, useEffect } from 'react';
import { FiUsers, FiTruck, FiShoppingBag, FiBarChart2 } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Spinner, Alert, Container } from 'react-bootstrap';
import Navbar from './AdminNavbar';
import Footer from '../Footer';
import api from '../../api/api';
import '../../styles/styles.css';

// ✅ Import necessary components from Chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ✅ Register components before using them
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (error) {
        console.error('❌ Error fetching stats:', error);
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="dashboard-page">
      <Navbar />
      <Container className="py-4">
        <h1 className="mb-4 text-center">Admin Dashboard</h1>

        {/* 🌀 Loading Animation */}
        {loading && (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
            <Spinner animation="border" variant="warning" />
          </div>
        )}

        {/* ❌ Error Message */}
        {error && <Alert variant="danger" className="text-center">{error}</Alert>}

        {/* ✅ Dashboard Content */}
        {!loading && !error && stats && (
          // inside the DashboardContent section
<>
  {/* 📊 Quick Stats */}
  <div className="stats-grid">
    <div className="stat-card">
      <FiUsers />
      <h3>{stats.users}</h3>
      <p>Total Users</p>
    </div>
    <div className="stat-card">
      <FiTruck />
      <h3>{stats.vendors}</h3>
      <p>Total Vendors</p>
    </div>
    <div className="stat-card">
      <FiShoppingBag />
      <h3>{stats.orders}</h3>
      <p>Total Orders</p>
    </div>
    <div className="stat-card">
      <FiBarChart2 />
      <h3>${stats.totalRevenue?.toFixed(2)}</h3>
      <p>Total Revenue</p>
    </div>
  </div>

  {/* 📊 Extra Metrics */}
  <div className="stats-grid mt-4">
    <div className="stat-card">
      <FiShoppingBag />
      <h3>${(stats.totalRevenue / stats.orders || 0).toFixed(2)}</h3>
      <p>Avg Order Value</p>
    </div>
    <div className="stat-card">
      <FiBarChart2 />
      <h3>{stats.salesGrowthRate ? `${stats.salesGrowthRate.toFixed(2)}%` : '0%'}</h3>
      <p>Monthly Sales Growth</p>
    </div>
  </div>

  {/* 📈 Sales Overview */}
  <section className="analytics-section mt-5">
    <h2 className="mb-3">Sales Overview</h2>
    <Line data={stats.salesData} />
  </section>

  {/* 🧾 Order Status Breakdown (Optional) */}
  {stats.statusBreakdown && (
    <section className="mt-5">
      <h2 className="mb-3">Order Status Breakdown</h2>
      <div className="status-grid">
        {Object.entries(stats.statusBreakdown).map(([status, count]) => (
          <div className="status-card" key={status}>
            <h4>{status}</h4>
            <p>{count} Orders</p>
          </div>
        ))}
      </div>
    </section>
  )}
</>
        )}
      </Container>
      <Footer />
    </div>
  );
};

export default AdminDashboard;