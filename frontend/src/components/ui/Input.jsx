import './ui.css';

const Input = ({ label, id, error, hint, className = '', ...props }) => {
  return (
    <div className={`ui-field-wrap ${className}`.trim()}>
      {label ? <label htmlFor={id} className="ui-label">{label}</label> : null}
      <input id={id} className={`ui-input ${error ? 'has-error' : ''}`.trim()} {...props} />
      {hint ? <small className="ui-hint">{hint}</small> : null}
      {error ? <small className="ui-error">{error}</small> : null}
    </div>
  );
};

export default Input;
