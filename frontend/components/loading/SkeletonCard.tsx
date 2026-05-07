'use client';

import { motion } from 'framer-motion';
import '@/styles/components/skeleton.css';

export default function SkeletonCard() {
  return (
    <motion.div
      className="skeleton-card"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="skeleton-header">
        <div className="skeleton-icon" />
        <div className="skeleton-label" />
      </div>
      <div className="skeleton-value" />
    </motion.div>
  );
}
