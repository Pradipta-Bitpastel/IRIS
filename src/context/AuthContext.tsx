// context/AuthContext.tsx
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import { useRouter } from 'next/router';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const router = useRouter();

  useEffect(() => {
    // Retrieve session data from sessionStorage
    const sessionData = sessionStorage.getItem('isAuthenticated');
    if (sessionData) {
      setIsAuthenticated(JSON.parse(sessionData));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export const authGuard=():boolean=>{
  const sessionData = window.localStorage.getItem('session');
  if (sessionData) {
    return true
  }
  else {
    return false
  }


}
