import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Card, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import '../styles/styles.css';

const AdminDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorRes = await axios.get('http://localhost:5001/admin/vendors');
        const customerRes = await axios.get('http://localhost:5001/admin/customers');
        const productRes = await axios.get('http://localhost:5001/admin/products');
        setVendors(vendorRes.data);
        setCustomers(customerRes.data);
        setProducts(productRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, []);

  const handleDelete = async (type, id) => {
    try {
      await axios.delete(`http://localhost:5001/admin/${type}/${id}`);
      alert(`${type.slice(0, -1).toUpperCase()} deleted successfully`);
      if (type === 'vendors') setVendors(vendors.filter((vendor) => vendor._id !== id));
      if (type === 'customers') setCustomers(customers.filter((customer) => customer._id !== id));
      if (type === 'products') setProducts(products.filter((product) => product._id !== id));
    } catch (err) {
      console.error('Error deleting:', err);
      alert('Failed to delete');
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col>
          <h2 className="text-center mb-4" style={{ color: '#FF5A4E' }}>Admin Dashboard</h2>
          <Card style={{ backgroundColor: '#FBB040', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card.Body>
              <Tabs defaultActiveKey="vendors" id="admin-tabs" className="mb-3">
                <Tab eventKey="vendors" title="Manage Vendors">
                  <Table responsive bordered hover>
                    <thead style={{ backgroundColor: '#FF5A4E', color: '#fff' }}>
                      <tr>
                        <th>#</th>
                        <th>Vendor Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.length > 0 ? (
                        vendors.map((vendor, index) => (
                          <tr key={vendor._id}>
                            <td>{index + 1}</td>
                            <td>{vendor.name}</td>
                            <td>{vendor.email}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete('vendors', vendor._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No vendors found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab>

                <Tab eventKey="customers" title="Manage Customers">
                  <Table responsive bordered hover>
                    <thead style={{ backgroundColor: '#FF5A4E', color: '#fff' }}>
                      <tr>
                        <th>#</th>
                        <th>Customer Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.length > 0 ? (
                        customers.map((customer, index) => (
                          <tr key={customer._id}>
                            <td>{index + 1}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete('customers', customer._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No customers found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab>

                <Tab eventKey="products" title="Manage Products">
                  <Table responsive bordered hover>
                    <thead style={{ backgroundColor: '#FF5A4E', color: '#fff' }}>
                      <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length > 0 ? (
                        products.map((product, index) => (
                          <tr key={product._id}>
                            <td>{index + 1}</td>
                            <td>{product.name}</td>
                            <td>{product.category}</td>
                            <td>${product.price}</td>
                            <td>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete('products', product._id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="text-center">No products found</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
