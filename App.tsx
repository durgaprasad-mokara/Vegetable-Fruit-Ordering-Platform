import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './components/home/HomePage';
import { ProductList } from './components/products/ProductList';
import { ProductDetail } from './components/products/ProductDetail';
import { CartSummary } from './components/cart/CartSummary';
import { CheckoutForm } from './components/checkout/CheckoutForm';
import { OrderList } from './components/orders/OrderList';
import { OrderDetail } from './components/orders/OrderDetail';
import { LoginForm } from './components/auth/LoginForm';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { initializeMockData } from './services/mockData';
import { getCurrentUser, isAdmin } from './services/authService';

// Protected route component
const ProtectedRoute: React.FC<{ 
  element: React.ReactNode; 
  requireAdmin?: boolean;
}> = ({ element, requireAdmin = false }) => {
  const user = getCurrentUser();
  const userIsAdmin = isAdmin();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !userIsAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

function App() {
  // Initialize mock data on app start
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartSummary />} />
          <Route path="/checkout" element={<CheckoutForm />} />
          <Route 
            path="/orders" 
            element={<ProtectedRoute element={<OrderList />} />} 
          />
          <Route 
            path="/orders/:id" 
            element={<ProtectedRoute element={<OrderDetail />} />} 
          />
          <Route path="/login" element={<LoginForm />} />
          <Route 
            path="/admin" 
            element={<ProtectedRoute element={<AdminDashboard />} requireAdmin={true} />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;