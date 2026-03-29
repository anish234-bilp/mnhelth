import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicForm from './pages/PublicForm';
import OwnerLogin from './pages/OwnerLogin';
import OwnerRegister from './pages/OwnerRegister';
import Dashboard from './pages/Dashboard';
import SubmissionDetail from './pages/SubmissionDetail';
import MHelth from './pages/MHelth';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public route — inquiry form */}
          <Route path="/form" element={<PublicForm />} />
            <Route path='/' element={<MHelth/>} />

          {/* Owner auth routes */}
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/register" element={<OwnerRegister />} />

          {/* Protected owner routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/owner/submissions/:id" element={
            <ProtectedRoute><SubmissionDetail /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;