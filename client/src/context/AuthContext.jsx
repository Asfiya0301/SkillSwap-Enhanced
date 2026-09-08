import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as api from '../api/services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.getProfile();
      setUser(data);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (credentials) => {
    const { data } = await api.loginUser(credentials);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (details) => {
    await api.registerUser(details);
    // Backend registration doesn't auto-login, so log in right after
    return login({ email: details.email, password: details.password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const updateLocalUser = (partial) => setUser((prev) => ({ ...prev, ...partial }));

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refetchProfile: fetchProfile, updateLocalUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
