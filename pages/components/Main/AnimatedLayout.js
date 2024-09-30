import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedLayout = ({ children }) => {
  const router = useRouter();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsRouteChanging(true);
    };

    const handleRouteChangeComplete = () => {
      setIsRouteChanging(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isRouteChanging && (
          <motion.div
            key="blink"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 z-50 bg-white"
          />
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default AnimatedLayout;