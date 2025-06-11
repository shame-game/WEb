import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { STORAGE_KEYS } from '../constants';

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true
};

// Action types
const actionTypes = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Utility function để parse JWT token
  const parseJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const user = localStorage.getItem(STORAGE_KEYS.USER);

    if (token && user) {
      try {
        let parsedUser = JSON.parse(user);
        // Nếu chưa có roleName, gán luôn là Admin
        if (!parsedUser.roleName) {
          parsedUser = { ...parsedUser, roleName: 'Admin' };
          localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(parsedUser));
        }
        dispatch({
          type: actionTypes.LOGIN_SUCCESS,
          payload: { token, user: parsedUser }
        });
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        dispatch({ type: actionTypes.SET_LOADING, payload: false });
      }
    } else {
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }, []);

  // Login action
  const login = (token, user) => {
    // Gán user có roleName: 'Admin' để toàn quyền
    const userWithRole = {
      ...user,
      roleName: 'Admin',
    };
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userWithRole));
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: { token, user: userWithRole }
    });
  };

  // Logout action
  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    dispatch({ type: actionTypes.LOGOUT });
  };

  const value = {
    ...state,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
