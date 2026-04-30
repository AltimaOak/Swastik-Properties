import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && <label className="text-sm font-bold text-zinc-700">{label}</label>}
      <input 
        className={`bg-white border border-zinc-200 text-zinc-900 px-4 py-3 rounded-2xl focus:outline-none focus:border-secondary/50 transition-all placeholder:text-zinc-400 shadow-sm ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
