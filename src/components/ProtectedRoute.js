import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, allowedRoles }) => {
  const role = localStorage.getItem('role');
  return allowedRoles.includes(role) ? <Component /> : <Navigate to="/login" />;
};

export default ProtectedRoute;