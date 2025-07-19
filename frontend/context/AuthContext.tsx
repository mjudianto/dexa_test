import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User } from '../types/User';
import { loginUser, isTokenExpired } from '../lib/auth';
import { useRouter } from 'next/router';
import { getUser } from '@/lib/user';

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  loginAdmin: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedAdminToken = localStorage.getItem('adminAuthToken');
    const storedUserData = localStorage.getItem('userData');

    if (storedToken && storedUserData && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      setUser(JSON.parse(storedUserData));
    } else if (storedAdminToken && storedUserData) {
      setToken(storedToken);
      setUser(JSON.parse(storedUserData));
    } else {
      logout();
    }
  }, []);

  const login = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    router.push('/');
  };

  const loginAdmin = (token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('adminAuthToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    router.push('/admin/home');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    router.push('/login');
  };

  const updateUser = async () => {
    await getUser()
    const storedUserData = localStorage.getItem('userData');
    setUser(JSON.parse(storedUserData!));
  };

  return (
    <AuthContext.Provider value={{ token, user, login, loginAdmin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
