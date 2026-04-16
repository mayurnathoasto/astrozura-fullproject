import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        try {
          const response = await api.get('/user');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Token verification failed', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
    window.addEventListener('auth:unauthorized', logout);
    return () => window.removeEventListener('auth:unauthorized', logout);
  }, []);

  const sendOtp = async (identifier) => {
    try {
      const response = await api.post('/send-otp', { identifier });
      return response.data;
    } catch (error) {
      throw error.response?.data || new Error('OTP send failed');
    }
  };

  const loginWithOtp = async (identifier, otp) => {
    try {
      const response = await api.post('/login', { identifier, otp });
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        return response.data;
      }
      return false;
    } catch (error) {
      throw error.response?.data || new Error('Login failed');
    }
  };

  const registerWithPassword = async (userData) => {
    try {
      const response = await api.post('/register', userData);
      if (response.data.success) {
        const { token: newToken, user: registeredUser } = response.data;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(registeredUser));
        setToken(newToken);
        setUser(registeredUser);
        return response.data;
      }
      return false;
    } catch (error) {
      throw error.response?.data || new Error('Registration failed');
    }
  };

  const loginWithPassword = async (credentials) => {
    try {
      const response = await api.post('/login-password', credentials);
      if (response.data.success) {
        const { token: newToken, user: loggedInUser } = response.data;
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setToken(newToken);
        setUser(loggedInUser);
        return response.data;
      }
      return false;
    } catch (error) {
      throw error.response?.data || new Error('Login failed');
    }
  };

  const setAuthFromOAuth = async (newToken) => {
    localStorage.setItem('auth_token', newToken);
    setToken(newToken);
    try {
      const response = await api.get('/user');
      if (response.data.success) {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      }
    } catch (error) {
      console.error('OAuth user fetch failed', error);
      logout();
    }
    return false;
  };

  const logout = async () => {
    try {
      if (localStorage.getItem('auth_token')) {
        await api.post('/logout');
      }
    } catch (error) {
      console.error('Logout API failed', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, sendOtp, loginWithOtp, registerWithPassword, loginWithPassword, setAuthFromOAuth, logout, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
