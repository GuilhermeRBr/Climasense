'use client';

import { motion } from 'framer-motion';
import { Cloud, Droplets, Sun, Moon } from 'lucide-react';
import '@/styles/components/loading-screen.css';

export default function LoadingScreen() {
  const icons = [Sun, Cloud, Droplets, Moon];

  return (
    <div className="loading-screen">
      <div className="loading-content">
        <motion.div
          className="loading-icons"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {icons.map((Icon, index) => (
            <motion.div
              key={index}
              className="loading-icon-wrapper"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: [0, 1, 1, 0],
                y: [20, 0, 0, -20],
              }}
              transition={{
                duration: 2,
                delay: index * 0.2,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            >
              <Icon size={40} className="loading-icon" />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="loading-text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2>ClimaSense</h2>
          <motion.div
            className="loading-dots"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
            >
              .
            </motion.span>
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
            >
              .
            </motion.span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
