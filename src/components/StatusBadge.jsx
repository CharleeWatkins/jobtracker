export const StatusBadge = ({ status }) => {
  const cls = status?.toLowerCase() || 'applied';
  return <span className={`status-badge ${cls}`}>{status}</span>;
};