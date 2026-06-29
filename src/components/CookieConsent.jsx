import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';

const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('swastik_cookie_consent');
    if (!consent) {
      // Show banner after a slight delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('swastik_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('swastik_cookie_consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-50 bg-zinc-950/90 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-white"
        >
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
              <Cookie size={24} />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h4 className="font-black text-sm uppercase tracking-wider text-white italic">
                  Cookie Preferences
                </h4>
                <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed">
                  We use cookies to enhance your browsing experience, serve personalized ads via Google AdSense, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. Read our{' '}
                  <Link to="/privacy-policy" className="text-primary hover:underline font-bold">
                    Privacy Policy
                  </Link>{' '}
                  for details.
                </p>
              </div>
              <div className="flex items-center space-x-3 text-xs font-bold uppercase tracking-wider">
                <button
                  onClick={handleAccept}
                  className="flex-1 py-2.5 px-4 bg-primary text-black rounded-xl hover:bg-yellow-400 transition-colors cursor-pointer text-center"
                >
                  Accept
                </button>
                <button
                  onClick={handleDecline}
                  className="py-2.5 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors cursor-pointer text-center"
                >
                  Decline
                </button>
              </div>
            </div>
            <button 
              onClick={() => setIsVisible(false)} 
              className="text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
