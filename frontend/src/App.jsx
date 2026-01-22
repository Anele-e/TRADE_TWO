import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { useAuth } from './context/AuthContext.jsx'
import Home from './pages/Home.jsx'
// import ForgotPassword from './pages/ForgotPassword.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        {/* <Route path="/forgot-password" element={<ForgotPassword />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
