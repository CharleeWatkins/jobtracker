import { useState, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Briefcase } from 'lucide-react';
import { StatsCards } from '../components/StatsCards';
import { JobCard } from '../components/JobCard';
import { JobModal } from '../components/JobModal';
import { DeleteModal } from '../components/DeleteModal';
import { Toast } from '../components/Toast';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const { user } = useAuth();
  const { jobs, loading, addJob, updateJob, deleteJob } = useJobs();

  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const statusFilter = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || 'date_desc';

  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

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

    if (statusFilter) {
      result = result.filter((j) => j.status === statusFilter);
    }

    result.sort((a, b) => {
      const da = new Date(a.dateApplied).getTime();
      const db = new Date(b.dateApplied).getTime();
      return sort === 'date_asc' ? da - db : db - da;
    });

    return result;
  }, [jobs, q, statusFilter, sort]);

  const handleSave = async (data) => {
    try {
      if (editingJob) {
        await updateJob(editingJob.id, data);
        showToast('Job updated successfully', 'success');
      } else {
        await addJob(data);
        showToast('Job added successfully', 'success');
      }
      setIsJobModalOpen(false);
      setEditingJob(null);
    } catch {
      showToast('Something went wrong', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!jobToDelete) return;
    try {
      await deleteJob(jobToDelete.id);
      showToast('Job deleted', 'error');
      setJobToDelete(null);
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Welcome back, {user?.username || 'Charlee'}!
        </h1>
        <p className="page-subtitle">My Job Applications</p>
      </div>

      <StatsCards jobs={jobs} />

      <div className="filter-bar">
        <div className="filter-group">
          <div className={`filter-pill ${statusFilter ? 'active' : ''}`}>
            <select
              value={statusFilter}
              onChange={(e) => updateParam('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div className={`filter-pill ${sort !== 'date_desc' ? 'active' : ''}`}>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              <option value="date_desc">Sort: Newest</option>
              <option value="date_asc">Sort: Oldest</option>
            </select>
          </div>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setEditingJob(null);
            setIsJobModalOpen(true);
          }}
        >
          <Plus size={18} /> Add Job
        </button>
      </div>

      {loading ? (
        <div className="loading">
          <div className="spinner" />
        </div>
      ) : visibleJobs.length > 0 ? (
        <div className="jobs-list">
          {visibleJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={(j) => {
                setEditingJob(j);
                setIsJobModalOpen(true);
              }}
              onDelete={(j) => setJobToDelete(j)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <Briefcase size={36} />
          </div>
          <h2 className="empty-title">
            {q || statusFilter ? 'No matching jobs' : 'No applications yet'}
          </h2>
          <p className="empty-desc">
            {q || statusFilter
              ? 'Try adjusting your search or filters.'
              : 'Start tracking your job applications to see them here.'}
          </p>
          {!q && !statusFilter && (
            <button
              className="btn-primary"
              onClick={() => {
                setEditingJob(null);
                setIsJobModalOpen(true);
              }}
            >
              <Plus size={18} /> Add Your First Job
            </button>
          )}
        </div>
      )}

      <JobModal
        key={editingJob ? `edit-${editingJob.id}` : 'new'}
        isOpen={isJobModalOpen}
        onClose={() => {
          setIsJobModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSave}
        editingJob={editingJob}
      />

      <DeleteModal
        isOpen={!!jobToDelete}
        onClose={() => setJobToDelete(null)}
        onConfirm={handleDeleteConfirm}
        jobLabel={
          jobToDelete ? `${jobToDelete.role} at ${jobToDelete.company}` : ''
        }
      />

      <div className="toast-container">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </div>
    </div>
  );
};