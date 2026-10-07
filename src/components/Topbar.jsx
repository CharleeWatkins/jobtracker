import { useState, useEffect } from 'react';
import { Menu, Search, User } from 'lucide-react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Logo } from './Logo';

export const Topbar = ({ onMenuClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get('q') || ''
  );

  const showSearch =
    location.pathname === '/dashboard' || location.pathname === '/jobs';

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (searchInput.trim()) next.set('q', searchInput.trim());
      else next.delete('q');

      const targetPath = showSearch ? location.pathname : '/dashboard';
      const desired = `${targetPath}?${next.toString()}`;
      const current = `${location.pathname}?${searchParams.toString()}`;

      if (current !== desired) {
        navigate(desired, { replace: true });
      }
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="hamburger-btn"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="topbar-brand">
          <Logo height={28} />
        </div>
      </div>

      {showSearch && (
        <div className="topbar-search">
          <Search size={16} color="#94a3b8" />
          <input
            placeholder="Search Applications..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      )}

      <div className="topbar-right">
        <button className="topbar-avatar" title={user?.username || 'User'}>
          <User size={18} />
        </button>
      </div>
    </header>
  );
};