import { useContext } from 'react';
import { AuthContext } from '../context/contextObject';

export const useAuth = () => useContext(AuthContext);