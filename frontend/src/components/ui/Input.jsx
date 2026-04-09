import React from 'react';
import './ui.css';

const Input = ({ label, id, className = '', ...props }) => {
  return (
    <div className={`ui-field-wrap ${className}`}>
      {label && <label htmlFor={id} className="ui-label">{label}</label>}
      <input id={id} className="ui-input" {...props} />
    </div>
  );
};

export default Input;
