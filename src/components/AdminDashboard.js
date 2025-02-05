import React, { useState } from 'react';
import styled from 'styled-components';
import { FiUsers, FiPackage, FiDollarSign, FiActivity } from 'react-icons/fi';
import { Chart } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import "../styles/styles.css";

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data - replace with real API calls
  const dashboardData = {
    stats: [
      { id: 1, title: 'Total Users', value: '2,543', icon: <FiUsers />, change: '+12.5%' },
      { id: 2, title: 'Products', value: '1,892', icon: <FiPackage />, change: '+3.2%' },
      { id: 3, title: 'Revenue', value: '$45,230', icon: <FiDollarSign />, change: '-2.1%' },
      { id: 4, title: 'Activity', value: '3,892', icon: <FiActivity />, change: '+8.4%' },
    ],
    recentOrders: [
      { id: '#1234', customer: 'John Doe', amount: '$234', status: 'Shipped' },
      { id: '#1235', customer: 'Jane Smith', amount: '$156', status: 'Processing' },
      { id: '#1236', customer: 'Bob Johnson', amount: '$589', status: 'Delivered' },
    ],
    salesData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Sales',
          data: [6500, 5900, 8000, 8100, 5600, 5500],
          borderColor: '#FF5A4E',
          tension: 0.4,
        },
      ],
    },
  };

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>AdminPanel</Logo>
        <NavMenu>
          {['dashboard', 'users', 'products', 'orders'].map((item) => (
            <NavItem
              key={item}
              active={activeMenu === item}
              onClick={() => setActiveMenu(item)}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </NavItem>
          ))}
        </NavMenu>
      </Sidebar>

      <MainContent>
        <Header>
          <SearchInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <UserProfile>AD</UserProfile>
        </Header>

        <StatsGrid>
          {dashboardData.stats.map((stat) => (
            <StatCard key={stat.id}>
              <StatIcon>{stat.icon}</StatIcon>
              <StatContent>
                <StatValue>{stat.value}</StatValue>
                <StatTitle>{stat.title}</StatTitle>
                <StatChange positive={stat.change.includes('+')}>
                  {stat.change}
                </StatChange>
              </StatContent>
            </StatCard>
          ))}
        </StatsGrid>

        <ChartContainer>
  <Line 
    data={dashboardData.salesData} 
    options={chartOptions}
    height={400}
  />
</ChartContainer>

        <RecentOrders>
          <h3>Recent Orders</h3>
          <OrderTable>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <StatusBadge status={order.status.toLowerCase()}>
                      {order.status}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </OrderTable>
        </RecentOrders>
      </MainContent>
    </DashboardContainer>
  );
};

// Styled Components
const DashboardContainer = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f8fafc;
`;

const Sidebar = styled.div`
  background: #2D3748;
  color: white;
  padding: 1.5rem;
  position: fixed;
  width: 240px;
  height: 100%;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 2rem;
`;

const NavMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NavItem = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? '#4A5568' : 'transparent'};
  
  &:hover {
    background: #4A5568;
  }
`;

const MainContent = styled.div`
  padding: 2rem;
  margin-left: 240px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  width: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #FF5A4E;
    box-shadow: 0 0 0 3px rgba(255,90,78,0.1);
  }
`;

const UserProfile = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #FF5A4E;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const StatIcon = styled.div`
  font-size: 1.5rem;
  color: #FF5A4E;
`;

const StatContent = styled.div``;

const StatValue = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatTitle = styled.div`
  color: #718096;
`;

const StatChange = styled.div`
  color: ${props => props.positive ? '#48BB78' : '#F56565'};
  font-size: 0.875rem;
`;
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#2D3748'
      }
    },
    title: {
      display: true,
      text: 'Sales Analytics',
      color: '#2D3748',
      font: {
        size: 16
      }
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#718096' }
    },
    y: {
      grid: { color: '#e2e8f0' },
      ticks: { color: '#718096' }
    }
  }
};

const ChartContainer = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const RecentOrders = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
`;

const OrderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    color: #718096;
    font-weight: 600;
  }
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => 
    props.status === 'shipped' ? '#C6F6D5' :
    props.status === 'processing' ? '#FEEBC8' :
    '#BEE3F8'};
  color: ${props => 
    props.status === 'shipped' ? '#22543D' :
    props.status === 'processing' ? '#7B341E' :
    '#2C5282'};  // Added missing quotes around the hex color
`;

export default AdminDashboard;