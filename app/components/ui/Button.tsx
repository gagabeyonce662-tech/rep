import {Link} from 'react-router';
import type {ReactNode} from 'react';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'white';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  animate?: boolean;
}

export function Button({
  children,
  to,
  onClick,
  variant = 'primary',
  className = '',
  type = 'button',
  animate = false,
}: ButtonProps) {
  const baseStyles = "px-8 py-3 font-anton uppercase tracking-widest text-sm transition-all duration-300 inline-block text-center";
  
  const variants = {
    primary: "bg-brand-black text-white hover:bg-brand-blue",
    secondary: "border border-brand-black text-brand-black hover:bg-brand-black hover:text-white",
    ghost: "bg-transparent text-brand-black/60 hover:text-brand-black",
    white: "bg-white text-brand-black hover:bg-brand-blue hover:text-white",
  };

  const animationClass = animate ? "hover:scale-105 active:scale-95" : "";
  const combinedStyles = `${baseStyles} ${variants[variant]} ${animationClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedStyles}>
      {children}
    </button>
  );
}
