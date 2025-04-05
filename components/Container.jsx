import React from 'react';

const Container = ({ children, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[calc(100vh-76px)] bg-gray-100 dark:bg-slate-800 w-full ${className}`}>
      {children}
    </div>
  );
};

export default Container;