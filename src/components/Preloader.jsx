import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Preloader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 1400; // 1.4 seconds
    const steps = 50;
    const stepTime = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progressVal = Math.min(Math.round((currentStep / steps) * 100), 100);
      setProgress(progressVal);

      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#FDFDFD] flex flex-col items-center justify-center select-none"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
    >
      {/* Decorative Brand Glow Circles */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Content Container */}
      <div className="flex flex-col items-center justify-center max-w-sm px-6 text-center relative z-10">
        
        {/* Logo Container in a Beautiful Premium White Card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] bg-white border border-zinc-100 flex items-center justify-center p-6 mb-8 shadow-premium relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-secondary/5 via-transparent to-primary/5 opacity-40"></div>
          <img 
            src="/logo.png" 
            alt="Swastik Properties Logo" 
            className="w-full h-auto object-contain animate-float drop-shadow-[0_10px_15px_rgba(128,0,0,0.06)]" 
          />
        </motion.div>

        {/* Brand Typography matching web theme */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-2xl md:text-3xl font-black italic tracking-[0.25em] text-secondary uppercase mb-2 font-sans"
        >
          Swastik
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-xs font-black uppercase tracking-[0.4em] text-zinc-400 mb-12"
        >
          Properties
        </motion.p>

        {/* Premium Light Progress Bar */}
        <motion.div 
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-48 h-[3px] bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200/50"
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-secondary via-primary to-secondary rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </motion.div>

        {/* Numeric loader indicator */}
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-3 tabular-nums"
        >
          Loading {progress}%
        </motion.span>
      </div>
    </motion.div>
  );
};

export default Preloader;
