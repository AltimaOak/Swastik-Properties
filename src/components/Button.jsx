import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const variants = {
    primary: 'bg-primary text-black hover:bg-black hover:text-white shadow-lg shadow-primary/20',
    secondary: 'bg-secondary text-white hover:bg-red-900 shadow-lg shadow-secondary/20',
    outline: 'border-2 border-secondary text-secondary hover:bg-secondary hover:text-white',
    ghost: 'text-zinc-500 hover:text-secondary hover:bg-zinc-100'
  };

  return (
    <button 
      className={`px-6 py-2.5 rounded-lg font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
