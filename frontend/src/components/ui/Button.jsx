import React from 'react';
import './ui.css';

const Button = ({ children, variant = 'primary', fullWidth, className = '', ...props }) => {
  const classes = `ui-btn ui-btn-${variant} ${fullWidth ? 'ui-btn-full' : ''} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
