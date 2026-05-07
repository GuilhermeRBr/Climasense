'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '@/styles/components/background-particles.css';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface BackgroundParticlesProps {
  weatherTheme: 'sunny' | 'cloudy' | 'rainy' | 'night';
}

export default function BackgroundParticles({ weatherTheme }: BackgroundParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const particleCount = weatherTheme === 'rainy' ? 50 : 30;
    
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));

    setParticles(newParticles);
  }, [weatherTheme]);

  const getParticleAnimation = () => {
    switch (weatherTheme) {
      case 'rainy':
        return {
          y: ['0%', '100%'],
          opacity: [0, 1, 0],
        };
      case 'sunny':
        return {
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        };
      case 'cloudy':
        return {
          x: ['-10%', '10%', '-10%'],
          opacity: [0.2, 0.4, 0.2],
        };
      case 'night':
        return {
          scale: [1, 1.5, 1],
          opacity: [0.4, 0.8, 0.4],
        };
      default:
        return {};
    }
  };

  return (
    <div className="particles-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`particle particle-${weatherTheme}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={getParticleAnimation()}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
