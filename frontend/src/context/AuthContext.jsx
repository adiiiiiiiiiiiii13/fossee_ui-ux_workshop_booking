import { createContext, useContext, useEffect, useState } from 'react';
import { fetchSession, login, logout, register } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = async () => {
    try {
      const data = await fetchSession();
      setUser(data.user ?? null);
      return data.user ?? null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession().catch(() => {
      setUser(null);
      setLoading(false);
    });
  }, []);

  const loginUser = async (credentials) => {
    const data = await login(credentials);
    setUser(data.user);
    return data.user;
  };

  const registerUser = async (payload) => register(payload);

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        loginUser,
        logoutUser,
        refreshSession,
        registerUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
