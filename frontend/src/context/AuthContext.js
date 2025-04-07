import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => 
    localStorage.getItem('authTokens') 
      ? JSON.parse(localStorage.getItem('authTokens')) 
      : null
  );
  const [user, setUser] = useState(() => 
    localStorage.getItem('authTokens') 
      ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
      : null
  );
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();

  const loginUser = async (email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: email,
          password: password
        })
      });
      
      const data = await response.json();
      
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify(data));
        navigate('/');
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.detail || 'Something went wrong during login'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'An error occurred during login'
      };
    }
  };

  const registerUser = async (username, email, password) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          email,
          password
        })
      });
      
      const data = await response.json();
      
      if (response.status === 201) {
        return { success: true };
      } else {
        return { 
          success: false, 
          message: Object.values(data).flat().join(' ') || 'Registration failed'
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'An error occurred during registration'
      };
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const updateToken = async () => {
    if (!authTokens) {
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh: authTokens?.refresh })
      });

      const data = await response.json();
      
      if (response.status === 200) {
        setAuthTokens({ ...authTokens, access: data.access });
        setUser(jwtDecode(data.access));
        localStorage.setItem('authTokens', JSON.stringify({ ...authTokens, access: data.access }));
      } else {
        logoutUser();
      }
    } catch (error) {
      console.error('Error refreshing token:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const fourMinutes = 1000 * 60 * 4;
    const interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, fourMinutes);
    
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    registerUser
  };

  return (
    <AuthContext.Provider value={contextData}>
      {!loading && children}
    </AuthContext.Provider>
  );
};