import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on initial load and listen for storage changes
  useEffect(() => {
    const restoreUser = () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      const name = localStorage.getItem('name');

      if (token && role) {
        console.log("🔄 Restoring user from localStorage:", role);
        setUser({ token, role, name });
      }
    };

    restoreUser();
    window.addEventListener("storage", restoreUser);
    return () => window.removeEventListener("storage", restoreUser);
  }, []);

  // Login function with additional user details
  const login = useCallback((token, role, name) => {
    if (!token) {
      console.error("❌ No token received! API might be failing.");
      return;
    }
  
    console.log("✅ Storing token:", token);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    if (name) localStorage.setItem("name", name);
  
    setUser({ token, role, name });
  }, []);

  // Logout function with redirection
  const logout = useCallback(() => {
    console.log("🚪 Logging out...");
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');

    setUser(null);
    window.location.href = "/login"; // Redirect after logout
  }, []);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user?.token;
  }, [user]);

  // Check if user has a specific role
  const hasRole = useCallback((requiredRole) => {
    return user?.role?.toLowerCase() === requiredRole.toLowerCase();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};