import './ui.css';

export default function Select({ label, id, error, hint, children, className = '', ...props }) {
  return (
    <div className={`ui-field-wrap ${className}`.trim()}>
      {label ? <label htmlFor={id} className="ui-label">{label}</label> : null}
      <select id={id} className={`ui-input ui-select ${error ? 'has-error' : ''}`.trim()} {...props}>
        {children}
      </select>
      {hint ? <small className="ui-hint">{hint}</small> : null}
      {error ? <small className="ui-error">{error}</small> : null}
    </div>
  );
}
