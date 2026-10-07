import { Briefcase, CheckCircle, Clock, XCircle } from 'lucide-react';

export const StatsCards = ({ jobs }) => {
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === 'Applied').length,
    interviewed: jobs.filter((j) => j.status === 'Interviewed').length,
    rejected: jobs.filter((j) => j.status === 'Rejected').length,
  };

  const cards = [
    { label: 'Total Applications', value: stats.total, icon: Briefcase },
    { label: 'Applied', value: stats.applied, icon: Clock },
    { label: 'Interviewed', value: stats.interviewed, icon: CheckCircle },
    { label: 'Rejected', value: stats.rejected, icon: XCircle },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <div className="stat-card" key={c.label}>
          <div className="stat-icon">
            <c.icon size={20} />
          </div>
          <div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};