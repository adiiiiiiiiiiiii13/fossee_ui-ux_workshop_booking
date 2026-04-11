const toneMap = {
  Accepted: 'success',
  Pending: 'warning',
  Deleted: 'muted',
};

export default function StatusBadge({ status }) {
  const tone = toneMap[status] || 'muted';
  return <span className={`status-badge status-${tone}`}>{status}</span>;
}
