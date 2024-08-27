import guidanceBackend from '@/services/guidanceBackend';
import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return !!localStorage.getItem('token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  });

  const logout = useCallback(async () => {
    try {
      await guidanceBackend.logout();
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error accessing localStorage:', error);
    }
  }, []);

  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated, logout }), [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
