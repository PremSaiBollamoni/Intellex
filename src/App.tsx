import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard/*" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </AnimatePresence>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;