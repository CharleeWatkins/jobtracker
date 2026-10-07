import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info' }) => {
  const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;
  return (
    <div className={`toast ${type}`}>
      <Icon size={18} />
      <span>{message}</span>
    </div>
  );
};