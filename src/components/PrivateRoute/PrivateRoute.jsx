import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

const PrivateRoute = ({ children, requiredRoles = [], requiredPermissions = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const { hasAnyPermission, hasAllPermissions } = usePermissions();
  const location = useLocation();
  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '1.125rem',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '2rem',
          height: '2rem',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  // Check role permissions if required roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.roleName);
    if (!hasRequiredRole) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Không có quyền truy cập</h2>
          <p>Bạn không có quyền truy cập vào trang này.</p>
        </div>
      );
    }
  }  // Check permission-based access if required permissions are specified
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermission = hasAnyPermission(requiredPermissions);
    if (!hasRequiredPermission) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <h2>Không có quyền truy cập</h2>
          <p>Bạn không có quyền truy cập vào trang này.</p>
        </div>
      );
    }
  }

  return children;
};

export default PrivateRoute;
