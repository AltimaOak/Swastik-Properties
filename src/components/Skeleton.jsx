import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div className={`bg-zinc-900 animate-pulse rounded-xl ${className}`}></div>
  );
};

export default Skeleton;
