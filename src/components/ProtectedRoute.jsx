import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-zinc-100 border-t-secondary rounded-full animate-spin"></div>
    </div>
  );

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // Wait for userData if we need to check the role
  if (role && !userData) {
    return (
      <div className="min-h-screen bg-[#FDFDFD] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-zinc-100 border-t-secondary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (role && userData?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
