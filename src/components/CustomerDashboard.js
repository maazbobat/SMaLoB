import React from 'react';
import styled from 'styled-components';
import { FiPackage, FiHeart, FiShield, FiDollarSign, FiClock } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import "../styles/styles.css";

const CustomerDashboard = () => {
  // Mock customer data
  const customerData = {
    user: {
      name: 'John Doe',
      email: 'john@example.com',
      joined: '2022-01-15',
      loyaltyPoints: 2450
    },
    orders: [
      { id: '#1234', date: '2023-03-15', items: 3, total: 149.99, status: 'Delivered' },
      { id: '#1235', date: '2023-04-02', items: 2, total: 89.99, status: 'Shipped' },
      { id: '#1236', date: '2023-04-15', items: 5, total: 299.99, status: 'Processing' },
    ],
    wishlist: [
      { id: 1, name: 'Wireless Headphones', price: 199.99, image: 'headphones.jpg' },
      { id: 2, name: 'Smart Watch', price: 249.99, image: 'smartwatch.jpg' },
    ],
    activity: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [{
        label: 'Monthly Spending',
        data: [450, 320, 600, 420],
        borderColor: '#FF5A4E',
        tension: 0.4,
      }]
    }
  };

  return (
    <DashboardContainer>
      <Header>
        <WelcomeMessage>
          <h1>Welcome back, {customerData.user.name}</h1>
          <p>Member since {new Date(customerData.user.joined).toLocaleDateString()}</p>
        </WelcomeMessage>
        
        <QuickStats>
          <StatCard>
            <FiPackage size={24} />
            <div>
              <h3>{customerData.orders.length}</h3>
              <p>Active Orders</p>
            </div>
          </StatCard>
          <StatCard>
            <FiHeart size={24} />
            <div>
              <h3>{customerData.wishlist.length}</h3>
              <p>Wishlist Items</p>
            </div>
          </StatCard>
          <StatCard>
            <FiDollarSign size={24} />
            <div>
              <h3>${customerData.user.loyaltyPoints}</h3>
              <p>Loyalty Points</p>
            </div>
          </StatCard>
        </QuickStats>
      </Header>

      <MainContent>
        <Section>
          <SectionHeader>
            <h2>Recent Orders</h2>
            <ViewAll>View All →</ViewAll>
          </SectionHeader>
          <OrdersGrid>
            {customerData.orders.map(order => (
              <OrderCard key={order.id}>
                <OrderHeader>
                  <span>Order {order.id}</span>
                  <StatusBadge status={order.status.toLowerCase()}>
                    {order.status}
                  </StatusBadge>
                </OrderHeader>
                <OrderDetails>
                  <p>{order.items} items</p>
                  <p>${order.total.toFixed(2)}</p>
                  <p><FiClock /> {new Date(order.date).toLocaleDateString()}</p>
                </OrderDetails>
              </OrderCard>
            ))}
          </OrdersGrid>
        </Section>

        <Section>
          <SectionHeader>
            <h2>Wishlist</h2>
            <ViewAll>View All →</ViewAll>
          </SectionHeader>
          <WishlistGrid>
            {customerData.wishlist.map(item => (
              <WishlistItem key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <h4>{item.name}</h4>
                  <p>${item.price.toFixed(2)}</p>
                  <ActionButton>Add to Cart</ActionButton>
                </ItemDetails>
              </WishlistItem>
            ))}
          </WishlistGrid>
        </Section>

        <Sidebar>
          <AccountCard>
            <h3>Account Security</h3>
            <SecurityStatus>
              <FiShield size={32} />
              <p>Your account is secure</p>
              <small>Last updated: 2 days ago</small>
            </SecurityStatus>
            <SecurityActions>
              <button>Change Password</button>
              <button>Two-Factor Auth</button>
            </SecurityActions>
          </AccountCard>

          <ActivityCard>
            <h3>Spending Overview</h3>
            <ChartContainer>
              <Line data={customerData.activity} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  title: { display: false }
                }
              }} />
            </ChartContainer>
          </ActivityCard>
        </Sidebar>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.header`
  margin-bottom: 2rem;
`;

const WelcomeMessage = styled.div`
  h1 {
    color: #2D3748;
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
  }
`;

const QuickStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.25rem;
  }

  p {
    color: #718096;
    font-size: 0.875rem;
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ViewAll = styled.button`
  color: #FF5A4E;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const OrderCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  background: ${props => 
    props.status === 'delivered' ? '#C6F6D5' :
    props.status === 'shipped' ? '#FEEBC8' :
    '#E9D8FD'};
  color: ${props => 
    props.status === 'delivered' ? '#22543D' :
    props.status === 'shipped' ? '#7B341E' :
    '#553C9A'};
`;

const OrderDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  color: #718096;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const WishlistGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const WishlistItem = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const ItemImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  padding: 1rem;

  h4 {
    margin-bottom: 0.5rem;
  }

  p {
    color: #718096;
    margin-bottom: 1rem;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #FF5A4E;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background: #ff7469;
  }
`;

const Sidebar = styled.aside`
  @media (max-width: 768px) {
    grid-row: 1;
  }
`;

const AccountCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
`;

const SecurityStatus = styled.div`
  text-align: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;

  p {
    margin: 0.5rem 0;
  }

  small {
    color: #718096;
  }
`;

const SecurityActions = styled.div`
  display: grid;
  gap: 0.5rem;

  button {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: none;
    cursor: pointer;

    &:hover {
      background: #f8fafc;
    }
  }
`;

const ActivityCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const ChartContainer = styled.div`
  height: 200px;
  margin-top: 1rem;
`;

export default CustomerDashboard;