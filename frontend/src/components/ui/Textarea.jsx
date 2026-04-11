import './ui.css';

export default function Textarea({ label, id, error, hint, className = '', ...props }) {
  return (
    <div className={`ui-field-wrap ${className}`.trim()}>
      {label ? <label htmlFor={id} className="ui-label">{label}</label> : null}
      <textarea id={id} className={`ui-input ui-textarea ${error ? 'has-error' : ''}`.trim()} {...props} />
      {hint ? <small className="ui-hint">{hint}</small> : null}
      {error ? <small className="ui-error">{error}</small> : null}
    </div>
  );
}
