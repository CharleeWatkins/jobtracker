import { useState } from 'react';
import { X } from 'lucide-react';

const EMPTY = {
  company: '',
  role: '',
  status: 'Applied',
  dateApplied: new Date().toISOString().split('T')[0],
  duties: '',
  requirements: '',
  address: '',
  contact: '',
  notes: '',
};

export const JobModal = ({ isOpen, onClose, onSave, editingJob }) => {
  const [form, setForm] = useState(() => {
    if (editingJob) return { ...EMPTY, ...editingJob };
    return EMPTY;
  });
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!form.company.trim()) errs.company = 'Company name is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.dateApplied) errs.dateApplied = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({
      company: form.company.trim(),
      role: form.role.trim(),
      status: form.status,
      dateApplied: form.dateApplied,
      duties: form.duties.trim(),
      requirements: form.requirements.trim(),
      address: form.address.trim(),
      contact: form.contact.trim(),
      notes: form.notes.trim(),
    });
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{editingJob ? 'Edit Job Application' : 'Add Job Application'}</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Name <span className="required">*</span></label>
              <input
                className="form-input"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                placeholder="e.g. mLab"
              />
              {errors.company && <span className="form-error">{errors.company}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Role <span className="required">*</span></label>
              <input
                className="form-input"
                value={form.role}
                onChange={(e) => update('role', e.target.value)}
                placeholder="e.g. Frontend Developer"
              />
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status <span className="required">*</span></label>
              <select
                className="form-select"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
              >
                <option value="Applied">Applied</option>
                <option value="Interviewed">Interviewed</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Date Applied <span className="required">*</span></label>
              <input
                type="date"
                className="form-input"
                value={form.dateApplied}
                onChange={(e) => update('dateApplied', e.target.value)}
              />
              {errors.dateApplied && <span className="form-error">{errors.dateApplied}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Duties</label>
            <textarea
              className="form-textarea"
              value={form.duties}
              onChange={(e) => update('duties', e.target.value)}
              placeholder="Describe the day-to-day responsibilities..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements</label>
            <textarea
              className="form-textarea"
              value={form.requirements}
              onChange={(e) => update('requirements', e.target.value)}
              placeholder="Skills, qualifications, and experience required..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Company Address</label>
              <input
                className="form-input"
                value={form.address}
                onChange={(e) => update('address', e.target.value)}
                placeholder="e.g. Cape Town, South Africa"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Details</label>
              <input
                className="form-input"
                value={form.contact}
                onChange={(e) => update('contact', e.target.value)}
                placeholder="e.g. hr@mlab.co.za"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Personal Notes</label>
            <textarea
              className="form-textarea"
              value={form.notes}
              onChange={(e) => update('notes', e.target.value)}
              placeholder="Anything you want to remember — interview prep, questions to ask..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingJob ? 'Save Changes' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};