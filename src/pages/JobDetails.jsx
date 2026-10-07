import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Calendar, MapPin, Mail, Menu } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { StatusBadge } from '../components/StatusBadge';
import { JobModal } from '../components/JobModal';
import { DeleteModal } from '../components/DeleteModal';
import { Toast } from '../components/Toast';
import { useJobs } from '../hooks/useJobs';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, updateJob, deleteJob, loading } = useJobs();
  const [job, setJob] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const toastId = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 3000);
  }, []);

  useEffect(() => {
  if (!loading) {
    const found = getJobById(id);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (found) setJob(found);
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id, loading]);

  const handleUpdate = async (data) => {
    try {
      const updated = await updateJob(id, data);
      setJob(updated);
      setIsEditOpen(false);
      showToast('Job updated successfully', 'success');
    } catch {
      showToast('Update failed', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(id);
      showToast('Job deleted', 'error');
      navigate('/dashboard');
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="main-content">
          <div className="loading"><div className="spinner" /></div>
        </main>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="app-container">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="main-content">
          <Link to="/dashboard" className="back-link">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <div className="empty-state">
            <h2 className="empty-title">Job not found</h2>
            <p className="empty-desc">This application doesn't exist or was deleted.</p>
          </div>
        </main>
      </div>
    );
  }

  const initial = (job.company || '?').charAt(0).toUpperCase();

  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="main-content">
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(true)} style={{ marginBottom: 16 }}>
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="details-header">
          <div className="details-title-row">
            <div className="details-company">
              <div className="job-logo" style={{ width: 64, height: 64, fontSize: '1.5rem' }}>
                {initial}
              </div>
              <div className="details-company-info">
                <h1>{job.role}</h1>
                <p>{job.company}</p>
                <div style={{ marginTop: 10 }}>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-secondary" onClick={() => setIsEditOpen(true)}>
                <Edit2 size={16} /> Edit
              </button>
              <button className="btn-secondary" onClick={() => setIsDeleteOpen(true)} style={{ color: '#EF4444', borderColor: '#FEE7E7' }}>
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        </div>

        <div className="details-grid">
          <div>
            {job.duties && (
              <div className="details-section">
                <h3>Job Duties</h3>
                <p>{job.duties}</p>
              </div>
            )}
            {job.requirements && (
              <div className="details-section">
                <h3>Requirements</h3>
                <p>{job.requirements}</p>
              </div>
            )}
            {job.notes && (
              <div className="details-section">
                <h3>Personal Notes</h3>
                <p>{job.notes}</p>
              </div>
            )}
          </div>

          <div>
            <div className="details-section">
              <h3>Information</h3>
              <div className="info-row">
                <span className="info-row-label">
                  <Calendar size={13} style={{ display: 'inline', marginRight: 6 }} />
                  Date Applied
                </span>
                <span className="info-row-value">
                  {new Date(job.dateApplied).toLocaleDateString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })}
                </span>
              </div>
              {job.address && (
                <div className="info-row">
                  <span className="info-row-label">
                    <MapPin size={13} style={{ display: 'inline', marginRight: 6 }} />
                    Address
                  </span>
                  <span className="info-row-value">{job.address}</span>
                </div>
              )}
              {job.contact && (
                <div className="info-row">
                  <span className="info-row-label">
                    <Mail size={13} style={{ display: 'inline', marginRight: 6 }} />
                    Contact
                  </span>
                  <span className="info-row-value">{job.contact}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <JobModal
        key={isEditOpen ? `edit-${job.id}` : 'closed'}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleUpdate}
        editingJob={job}
      />

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        jobLabel={`${job.role} at ${job.company}`}
      />

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
};