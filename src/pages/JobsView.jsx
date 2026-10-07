import { useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, Calendar, MapPin, Mail } from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { useJobs } from '../hooks/useJobs';

export const JobsView = () => {
  const navigate = useNavigate();
  const { jobs, loading } = useJobs();
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const visibleJobs = useMemo(() => {
    let result = [...jobs];
    if (q) {
      const query = q.toLowerCase();
      result = result.filter(
        (j) =>
          (j.company || '').toLowerCase().includes(query) ||
          (j.role || '').toLowerCase().includes(query)
      );
    }
    return result;
  }, [jobs, q]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Applications</h1>
        <p className="page-subtitle">
          Full overview of every application · {visibleJobs.length} total
        </p>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : visibleJobs.length > 0 ? (
        <div className="view-list">
          {visibleJobs.map((job) => {
            const initial = (job.company || '?').charAt(0).toUpperCase();
            return (
              <div
                key={job.id}
                className="view-card"
                onClick={() => navigate(`/jobs/${job.id}`)}
              >
                <div className="view-card-header">
                  <div className="view-card-title-row">
                    <div className="job-logo">{initial}</div>
                    <div style={{ flex: 1 }}>
                      <div className="job-title">{job.role}</div>
                      <div className="job-company">{job.company}</div>
                    </div>
                    <div className="view-only-badge">
                      <Eye size={13} />
                      View only
                    </div>
                  </div>

                  <div className="view-card-meta">
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

                <div className="view-card-body">
                  {job.duties && (
                    <div className="view-section">
                      <h4 className="view-section-title">Job Duties</h4>
                      <p className="view-section-text">{job.duties}</p>
                    </div>
                  )}

                  {job.requirements && (
                    <div className="view-section">
                      <h4 className="view-section-title">Requirements</h4>
                      <p className="view-section-text">{job.requirements}</p>
                    </div>
                  )}

                  {(job.address || job.contact) && (
                    <div className="view-info-grid">
                      {job.address && (
                        <div className="view-info-item">
                          <MapPin size={14} />
                          <div>
                            <span className="view-info-label">Address</span>
                            <span className="view-info-value">{job.address}</span>
                          </div>
                        </div>
                      )}
                      {job.contact && (
                        <div className="view-info-item">
                          <Mail size={14} />
                          <div>
                            <span className="view-info-label">Contact</span>
                            <span className="view-info-value">{job.contact}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {job.notes && (
                    <div className="view-section">
                      <h4 className="view-section-title">Personal Notes</h4>
                      <p className="view-section-text">{job.notes}</p>
                    </div>
                  )}

                  {!job.duties &&
                    !job.requirements &&
                    !job.address &&
                    !job.contact &&
                    !job.notes && (
                      <p className="view-empty-hint">
                        No additional details were added for this application.
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Eye size={36} />
          </div>
          <h2 className="empty-title">No applications yet</h2>
          <p className="empty-desc">
            Start adding jobs from the dashboard to see them here.
          </p>
        </div>
      )}
    </div>
  );
};