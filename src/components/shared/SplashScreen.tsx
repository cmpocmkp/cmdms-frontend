/**
 * Splash Screen Component
 * Shows CMDMS logo with smooth animations on login and page refresh
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Import logo - using public path for Vite
const logoPath = '/assets/logos/logo.svg';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number; // Duration in milliseconds
}

export default function SplashScreen({ onComplete, duration = 2000 }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for exit animation to complete
      setTimeout(() => {
        onComplete();
      }, 500);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #0E8160 0%, #17c653 50%, #1DC39F 100%)'
          }}
        >
          <div className="flex flex-col items-center justify-center">
            {/* Logo Animation */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2
              }}
              className="mb-6"
            >
              <img
                src={logoPath}
                alt="CMDMS Logo"
                className="h-24 w-auto md:h-32"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))' }}
                onError={(e) => {
                  // Fallback if logo not found
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </motion.div>

            {/* Text Animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5,
                duration: 0.5
              }}
              className="text-center"
            >
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Chief Minister's Decision Management System
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                CM DMS
              </p>
            </motion.div>

            {/* Loading Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    className="w-3 h-3 bg-white rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: index * 0.2,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
