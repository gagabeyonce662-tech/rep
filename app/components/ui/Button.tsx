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
  const baseStyles = "px-10 py-4 font-assistant font-medium uppercase tracking-[0.25em] text-[11px] transition-colors duration-500 inline-block text-center border";

  const variants = {
    primary: "bg-brand-black text-brand-bg border-brand-black hover:bg-brand-accent hover:border-brand-accent",
    secondary: "border-brand-black/60 text-brand-black bg-transparent hover:border-brand-black hover:bg-brand-black hover:text-brand-bg",
    ghost: "bg-transparent border-transparent text-brand-muted hover:text-brand-black",
    white: "bg-transparent text-white border-white/80 hover:bg-white hover:text-brand-black",
  };

  const animationClass = animate ? "hover:scale-105 active:scale-95" : "";
  const combinedStyles = `${baseStyles} ${variants[variant]} ${animationClass} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedStyles} onClick={onClick}>
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
