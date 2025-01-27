import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Services = () => {
  return (
    <Container className="mt-5">
      <h1 className="text-center mb-4">Our Services</h1>
      <Row>
        <Col md={6}>
          <Card className="service-card">
            <Card.Body>
              <Card.Title>Business Listing</Card.Title>
              <Card.Text>Get your business listed and attract more customers.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="service-card">
            <Card.Body>
              <Card.Title>Marketing Solutions</Card.Title>
              <Card.Text>Boost your online presence with our marketing services.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Services;