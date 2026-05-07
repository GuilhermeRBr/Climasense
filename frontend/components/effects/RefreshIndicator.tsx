'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import '@/styles/components/refresh-indicator.css';

interface RefreshIndicatorProps {
  isRefreshing: boolean;
}

export default function RefreshIndicator({ isRefreshing }: RefreshIndicatorProps) {
  return (
    <AnimatePresence>
      {isRefreshing && (
        <motion.div
          className="refresh-indicator"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            <RefreshCw size={16} />
          </motion.div>
          <span>Atualizando dados...</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
