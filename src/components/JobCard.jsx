import { useNavigate } from 'react-router-dom';
import { Calendar, Edit2, Trash2 } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

export const JobCard = ({ job, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const initial = (job.company || '?').charAt(0).toUpperCase();

  const handleCardClick = (e) => {
    // Don't navigate if user clicked edit/delete
    if (e.target.closest('.job-actions')) return;
    navigate(`/jobs/${job.id}`);
  };

  return (
    <div className="job-card" onClick={handleCardClick}>
      <div className="job-logo">{initial}</div>

      <div className="job-body">
        <div className="job-header">
          <div>
            <div className="job-title">{job.role}</div>
            <div className="job-company">{job.company}</div>
          </div>
          <div className="job-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="icon-btn"
              onClick={() => onEdit(job)}
              aria-label="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              className="icon-btn danger"
              onClick={() => onDelete(job)}
              aria-label="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="job-meta">
          <StatusBadge status={job.status} />
          {job.dateApplied && (
            <div className="job-date">
              <Calendar size={13} />
              {new Date(job.dateApplied).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};