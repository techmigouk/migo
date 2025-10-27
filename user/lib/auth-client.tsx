'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: 'loading',
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function useSession() {
  return useContext(AuthContext);
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setSession(null);
        setStatus('unauthenticated');
        return;
      }

      // Verify token with backend
      const res = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (res.ok) {
        const data = await res.json();
        setSession(data);
        setStatus('authenticated');
      } else {
        // Token invalid, clear it
        localStorage.removeItem('token');
        setSession(null);
        setStatus('unauthenticated');
      }
    } catch (error) {
      console.error('Session check failed:', error);
      setSession(null);
      setStatus('unauthenticated');
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setSession({ user: data.user });
    setStatus('authenticated');
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed');
    }

    // Store token and user data
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    
    setSession({ user: data.user });
    setStatus('authenticated');
  };

  const logout = async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
    });

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setSession(null);
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ data: session, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
