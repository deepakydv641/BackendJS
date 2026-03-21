import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Try to fetch current user on mount (uses cookie / stored token)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    api.get('/current-user')
      .then(({ data }) => setUser(data.data?.User || data.data))
      .catch(() => {
        localStorage.removeItem('accessToken');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await api.post('/login', credentials);
    const { user, accessToken } = data.data;
    localStorage.setItem('accessToken', accessToken);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/current-user');
    const fresh = data.data?.User || data.data;
    setUser(fresh);
    return fresh;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
