/**
 * Main App Component
 * Provides routing and authentication context
 */

import { useState, useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { router } from './routes';
import SplashScreen from './components/shared/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // Show splash on initial page load/refresh
    if (isInitialLoad) {
      setIsInitialLoad(false);
      // Splash will auto-hide after duration
    }
  }, [isInitialLoad]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      {showSplash && (
        <SplashScreen 
          onComplete={handleSplashComplete}
          duration={2000}
        />
      )}
    </AuthProvider>
  );
}

export default App;
