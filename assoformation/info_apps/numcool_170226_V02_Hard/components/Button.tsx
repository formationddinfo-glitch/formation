import React from 'react';

interface ButtonProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  className?: string;
  ariaLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  variant = 'primary', 
  className = '',
  ariaLabel
}) => {
  const baseStyle = "transform transition-all duration-200 active:scale-95 font-bold text-xl md:text-2xl px-8 py-4 rounded-full shadow-lg flex items-center justify-center gap-3";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border-b-4 border-blue-800",
    secondary: "bg-white hover:bg-slate-100 text-slate-700 border-2 border-slate-300",
    success: "bg-green-500 hover:bg-green-600 text-white border-b-4 border-green-700",
    danger: "bg-red-500 hover:bg-red-600 text-white border-b-4 border-red-700",
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};