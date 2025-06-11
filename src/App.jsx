import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout, PrivateRoute } from './components';
import { PERMISSIONS } from './utils/permissions';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Accounts from './pages/Accounts/Accounts';
import Roles from './pages/Roles/Roles';
import Customers from './pages/Customers/Customers';
import RoomTypes from './pages/RoomTypes/RoomTypes';
import Rooms from './pages/Rooms/Rooms';
import Services from './pages/Services/Services';
import Bookings from './pages/Bookings/Bookings';
import Invoices from './pages/Invoices/Invoices';
import Inventory from './pages/Inventory/Inventory';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/accounts" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.USER_MANAGEMENT]}>
              <Layout>
                <Accounts />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/roles" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.ROLE_MANAGEMENT]}>
              <Layout>
                <Roles />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/customers" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.CUSTOMER_READ]}>
              <Layout>
                <Customers />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/room-types" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.ROOM_TYPE_MANAGEMENT]}>
              <Layout>
                <RoomTypes />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/rooms" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.ROOM_READ]}>
              <Layout>
                <Rooms />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/services" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.SERVICE_MANAGEMENT]}>
              <Layout>
                <Services />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/bookings" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.BOOKING_READ]}>
              <Layout>
                <Bookings />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/invoices" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.INVOICE_READ]}>
              <Layout>
                <Invoices />
              </Layout>
            </PrivateRoute>
          } />
          
          <Route path="/inventory" element={
            <PrivateRoute requiredPermissions={[PERMISSIONS.INVENTORY_READ]}>
              <Layout>
                <Inventory />
              </Layout>
            </PrivateRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App
