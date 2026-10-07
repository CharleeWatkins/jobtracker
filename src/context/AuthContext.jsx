import { useState } from 'react';
import { AuthContext } from './contextObject';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('jt_token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken, newUser) => {
    localStorage.setItem('jt_token', newToken);
    localStorage.setItem('jt_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('jt_token');
    localStorage.removeItem('jt_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading: false, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};