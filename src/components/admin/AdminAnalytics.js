import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import AdminNavbar from "./AdminNavbar";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend);

const AdminAnalytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        totalSales: 0,
        newUsers: 0,
        activeVendors: 0,
        salesChart: { labels: [], datasets: [] },
        usersChart: { labels: [], datasets: [] }
      });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
        const token = localStorage.getItem("token"); // Get token from storage
      
        if (!token) {
          console.error("❌ No token found! User might not be logged in.");
          setLoading(false);
          return;
        }
      
        try {
          const response = await fetch("http://localhost:3001/api/admin/analytics", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // ✅ Attach token
            },
          });
      
          if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
          }
      
          const data = await response.json();
          setAnalyticsData({
            totalSales: data.totalSales || 0,
            newUsers: data.newUsers || 0,
            activeVendors: data.activeVendors || 0,
            salesChart: data.salesChart || { labels: [], datasets: [] },
            usersChart: data.usersChart || { labels: [], datasets: [] },
          });
      
        } catch (error) {
          console.error("❌ Error fetching analytics:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchAnalytics();
  }, []);


  if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;

  return (
    <div className="min-h-screen">
      <AdminNavbar />
      <Container className="py-5">
        <h2 className="mb-4">Admin Analytics</h2>
        
        <Row className="mb-4">
          <Col md={4}>
            <Card className="p-4 text-center shadow">
              <h5>Total Sales</h5>
              <h3>${analyticsData.totalSales}</h3>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="p-4 text-center shadow">
              <h5>New Users</h5>
              <h3>{analyticsData.newUsers}</h3>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="p-4 text-center shadow">
              <h5>Active Vendors</h5>
              <h3>{analyticsData.activeVendors}</h3>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Card className="p-4 shadow">
              <h5>Sales Over Time</h5>
              {analyticsData.salesChart.labels.length > 0 ? (
  <Line data={analyticsData.salesChart} />
) : (
  <p className="text-center text-muted">No sales data available</p>
)}
            </Card>
          </Col>
          <Col md={6}>
            <Card className="p-4 shadow">
              <h5>Monthly Users Growth</h5>
              {analyticsData.usersChart.labels.length > 0 ? (
  <Bar data={analyticsData.usersChart} />
) : (
  <p className="text-center text-muted">No user data available</p>
)}
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminAnalytics;