import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'demo@example.com' && password === 'demo123') {
        login(email, password);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError('Invalid email or password. Try demo@example.com / demo123');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col items-center justify-center p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            animate={{
              x: ['0vw', '100vw'],
              y: [i * 20 + 'vh', i * 20 + 10 + 'vh'],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + i * 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            <Sparkles
              className="text-white opacity-10"
              size={20 + i * 10}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="glass-effect p-8 rounded-2xl shadow-2xl w-full max-w-md mb-8 relative z-10"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="flex items-center justify-center mb-8"
        >
          <motion.div
            className="floating flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Brain className="w-12 h-12 text-white" />
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold ml-3 text-white"
            >
              Intellex
            </motion.h1>
          </motion.div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-500 bg-opacity-20 text-white p-3 rounded-lg text-sm text-center"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12 group-hover:border-blue-500 transition-colors"
                placeholder="Enter your email"
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-blue-500 transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 group-hover:border-blue-500 transition-colors"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </motion.div>

          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            type="submit"
            className="btn-primary w-full flex items-center justify-center relative overflow-hidden group"
            disabled={isLoading}
          >
            <span className="relative z-10 flex items-center">
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <span>Sign in</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5], opacity: [0.5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    style={{ borderRadius: '100%' }}
                  />
                </>
              )}
            </span>
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <p className="text-white text-sm mb-2">
            Experience the next generation of AI interaction
          </p>
          <div className="flex justify-center space-x-2">
            {['Chat', 'Vision', 'Voice'].map((feature, index) => (
              <motion.span
                key={feature}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="px-3 py-1 bg-white/10 rounded-full text-xs text-white"
              >
                {feature}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
      
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-white text-sm text-center absolute bottom-4"
      >
        Developed By Prem, CUTM 2025 all rights reserved
      </motion.footer>
    </div>
  );
};

export default Login;