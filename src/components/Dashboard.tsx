import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, LogOut, MessageSquare, Image, Mic, Settings, ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import IntellexChat from './IntellexChat';
import IntellexVis from './IntellexVis';
import IntellexAsk from './IntellexAsk';

const MODELS = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite-preview-02-05",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-1.5-pro"
];

const Dashboard = () => {
  const { isDark, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const features = [
    {
      path: 'chat',
      title: 'IntellexChat',
      description: 'Advanced text-based conversations',
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600'
    },
    {
      path: 'vis',
      title: 'IntellexVis',
      description: 'Intelligent image analysis',
      icon: Image,
      color: 'from-green-500 to-green-600'
    },
    {
      path: 'ask',
      title: 'IntellexAsk',
      description: 'Voice-enabled interactions',
      icon: Mic,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const isFeaturePage = location.pathname !== '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              {isFeaturePage && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate('/dashboard')}
                  className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </motion.button>
              )}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                Intellex
              </h1>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-4"
            >
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all duration-200"
              >
                {MODELS.map((model) => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>

              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-gray-300" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {location.pathname === '/dashboard' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`feature-card bg-gradient-to-r ${feature.color} text-white cursor-pointer p-8 rounded-2xl`}
                onClick={() => navigate(feature.path)}
              >
                <feature.icon className="w-8 h-8 mb-4" />
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-gray-100">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <Routes>
            <Route path="chat" element={<IntellexChat model={selectedModel} />} />
            <Route path="vis" element={<IntellexVis model={selectedModel} />} />
            <Route path="ask" element={<IntellexAsk model={selectedModel} />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              {/* Add settings options here */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-0 w-full py-4 bg-white dark:bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 dark:text-gray-300 text-sm">
          Developed By Prem, CUTM 2025 all rights reserved
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;