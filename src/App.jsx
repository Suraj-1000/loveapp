import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Home } from './pages/Home';
import { DateInvitation } from './pages/DateInvitation';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Creator Landing / Quick Generator */}
          <Route path="/" element={<Home />} />

          {/* Girlfriend Unique Invitation Link (/date/:inviteCode) */}
          <Route path="/date/:inviteCode" element={<DateInvitation />} />
          
          {/* Default fallback route for /date */}
          <Route path="/date" element={<Navigate to="/date/demo-love-2026" replace />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Dashboard */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
