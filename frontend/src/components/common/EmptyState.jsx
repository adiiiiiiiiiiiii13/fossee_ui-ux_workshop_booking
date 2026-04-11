export default function EmptyState({ title, description, action }) {
  return (
    <section className="empty-state">
      <p className="eyebrow">Nothing here yet</p>
      <h3>{title}</h3>
      <p>{description}</p>
      {action ? <div className="empty-action">{action}</div> : null}
    </section>
  );
}
