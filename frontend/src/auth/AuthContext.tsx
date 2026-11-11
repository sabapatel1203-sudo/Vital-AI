import React, { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';

export type UserRole = 'patient' | 'doctor' | 'researcher';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

// Mock user database for prototype
const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'patient@vitalis.ai': {
    password: 'patient123',
    user: {
      id: 'u-patient-001',
      email: 'patient@vitalis.ai',
      name: 'Sarah Mitchell',
      role: 'patient',
    },
  },
  'doctor@vitalis.ai': {
    password: 'doctor123',
    user: {
      id: 'u-doctor-001',
      email: 'doctor@vitalis.ai',
      name: 'Dr. James Chen',
      role: 'doctor',
    },
  },
  'researcher@vitalis.ai': {
    password: 'research123',
    user: {
      id: 'u-research-001',
      email: 'researcher@vitalis.ai',
      name: 'Dr. Aisha Patel',
      role: 'researcher',
    },
  },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage
    const stored = localStorage.getItem('vitalis_auth_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('vitalis_auth_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));
    const entry = MOCK_USERS[email.toLowerCase()];
    if (entry && entry.password === _password) {
      setUser(entry.user);
      localStorage.setItem('vitalis_auth_user', JSON.stringify(entry.user));
      return true;
    }
    return false;
  }, []);

  const register = useCallback(
    async (name: string, email: string, _password: string, role: UserRole): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      const newUser: User = {
        id: `u-${role}-${Date.now()}`,
        email,
        name,
        role,
      };
      setUser(newUser);
      localStorage.setItem('vitalis_auth_user', JSON.stringify(newUser));
      return true;
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('vitalis_auth_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
