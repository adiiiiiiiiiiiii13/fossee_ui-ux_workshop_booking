import './ui.css';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`ui-card ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Card;
