import { useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';
import { useAuth } from './useAuth';

export const useJobs = () => {
  const { token, user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!token || !user) return;
    try {
      setLoading(true);
      const data = await api.get('/jobs', token);
      setJobs(data);
      console.log(token);
      console.log(data);
    } catch (err) {
      console.error('[useJobs] fetch failed:', err);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (job) => {
    try {
      const created = await api.post('/jobs', { ...job, userId: user.id }, token);
      setJobs((prev) => [created, ...prev]);
      setTimeout(() => fetchJobs(), 100);
      return created;
    } catch (err) {
      console.error('[useJobs] POST failed:', err);
      throw err;
    }
  };

  const updateJob = async (id, updates) => {
    const updated = await api.patch(`/jobs/${id}`, updates, token);
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
    return updated;
  };

  const deleteJob = async (id) => {
    await api.delete(`/jobs/${id}`, token);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const getJobById = (id) => jobs.find((j) => String(j.id) === String(id));

  return {
    jobs,
    loading,
    addJob,
    updateJob,
    deleteJob,
    getJobById,
    refetch: fetchJobs,
  };
};