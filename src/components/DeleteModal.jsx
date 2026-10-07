import { Trash2 } from 'lucide-react';

export const DeleteModal = ({ isOpen, onClose, onConfirm, jobLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content delete-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="delete-icon">
          <Trash2 size={30} />
        </div>
        <h2 className="delete-title">Delete Application?</h2>
        <p className="delete-text">
          Are you sure you want to delete <strong>{jobLabel}</strong>? This action cannot be undone.
        </p>
        <div className="delete-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
};