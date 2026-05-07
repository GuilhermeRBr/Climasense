'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import '@/styles/components/theme-transition.css';

interface ThemeTransitionProps {
  theme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function ThemeTransition({ theme }: ThemeTransitionProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [prevTheme, setPrevTheme] = useState(theme);

  useEffect(() => {
    if (theme !== prevTheme) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setPrevTheme(theme);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [theme, prevTheme]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className={`theme-transition theme-transition-${theme}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      )}
    </AnimatePresence>
  );
}
