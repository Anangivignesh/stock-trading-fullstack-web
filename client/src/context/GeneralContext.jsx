import React, { createContext, useContext, useState, useEffect } from 'react';

const GeneralContext = createContext();

export const GeneralProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('sb_stocks_token');
      const storedUser = localStorage.getItem('sb_stocks_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('sb_stocks_token', userToken);
    localStorage.setItem('sb_stocks_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sb_stocks_token');
    localStorage.removeItem('sb_stocks_user');
  };

  return (
    <GeneralContext.Provider value={{ user, token, login, logout, setUser }}>
      {children}
    </GeneralContext.Provider>
  );
};

export const useGeneral = () => useContext(GeneralContext);
