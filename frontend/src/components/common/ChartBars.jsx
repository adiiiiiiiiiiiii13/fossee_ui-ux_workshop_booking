export default function ChartBars({ title, labels = [], values = [] }) {
  const max = Math.max(...values, 1);

  return (
    <section className="chart-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Breakdown</p>
          <h3>{title}</h3>
        </div>
      </div>
      {labels.length === 0 ? (
        <p className="muted-text">No data available for the selected filters.</p>
      ) : (
        <div className="chart-stack">
          {labels.map((label, index) => (
            <div className="chart-row" key={`${label}-${index}`}>
              <div className="chart-meta">
                <span>{label}</span>
                <strong>{values[index] ?? 0}</strong>
              </div>
              <div className="chart-track">
                <div
                  className="chart-fill"
                  style={{ width: `${((values[index] ?? 0) / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
