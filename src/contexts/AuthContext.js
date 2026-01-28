import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      // For demo purposes, accept any email/password
      // In a real app, this would make an API call to verify credentials
      if (credentials.email && credentials.password) {
        const userData = {
          email: credentials.email,
          name: credentials.email.split('@')[0], // Simple name generation
          role: 'admin'
        };
        setUser(userData);
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (userData) => {
    try {
      // For demo purposes, accept any registration
      // In a real app, this would make an API call to create a new user
      if (userData.email && userData.password) {
        const newUser = {
          email: userData.email,
          name: userData.name || userData.email.split('@')[0],
          role: 'user'
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return newUser;
      }
      throw new Error('Invalid registration data');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  // Check for existing user data on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value = {
    user,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 