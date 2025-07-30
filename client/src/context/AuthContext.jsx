// import { createContext, useContext, useEffect, useState } from 'react';

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authState, setAuthState] = useState({
//     token: null,
//     userId: null,
//     role: null,
//   });

//   // Load auth state from localStorage on mount
//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     const userId = localStorage.getItem('userId');
//     const role = localStorage.getItem('role');

//     if (token && userId && role) {
//       setAuthState({ token, userId, role });
//     }
//   }, []);

//   // Login function to set auth state and store in localStorage if rememberMe is true
//   const login = (token, userId, role, rememberMe = false) => {
//     setAuthState({ token, userId, role });

//     if (rememberMe) {
//       localStorage.setItem('authToken', token);
//       localStorage.setItem('userId', userId);
//       localStorage.setItem('role', role);
//     }
//   };

//   // Logout function to clear auth state and localStorage
//   const logout = () => {
//     setAuthState({ token: null, userId: null, role: null });
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('userId');
//     localStorage.removeItem('role');
//   };

//   return (
//     <AuthContext.Provider value={{ authState, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };




import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    userId: null,
    role: null,
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');

    if (token && userId && role) {
      setAuthState({ token, userId, role });
    }
  }, []);

  // Login function to set auth state and store in localStorage if rememberMe is true
  const login = (token, userId, role, rememberMe = false) => {
    setAuthState({ token, userId, role });

    if (rememberMe) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
    }
  };

  // Logout function to clear auth state and localStorage
  const logout = () => {
    setAuthState({ token: null, userId: null, role: null });
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};